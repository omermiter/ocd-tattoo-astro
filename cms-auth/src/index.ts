// Decap CMS's "github" backend needs an OAuth token to write to the repo
// through GitHub's API. GitHub Pages can't run this exchange (it needs the
// OAuth App's client *secret*, which must never reach the browser), so it
// lives here as its own small Worker — same reason worker/ exists for the
// contact form. Protocol: https://decapcms.org/docs/backends-overview/#github-backend

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Step 1: the CMS admin page opens this in a popup. Bounce straight to
    // GitHub's own consent screen.
    if (url.pathname === '/auth') {
      const scope = url.searchParams.get('scope') ?? 'repo,user';
      const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
      authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      authorizeUrl.searchParams.set('scope', scope);
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    // Step 2: GitHub redirects back here with a one-time code. Exchange it
    // for an access token server-side (needs the client secret) and hand
    // the token back to the popup's opener via postMessage.
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code', { status: 400 });
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = (await tokenRes.json()) as TokenResponse;

      if (!tokenData.access_token) {
        return renderResult('error', tokenData.error_description ?? tokenData.error ?? 'GitHub OAuth failed');
      }

      return renderResult('success', tokenData.access_token);
    }

    return new Response('Not found', { status: 404 });
  },
};

// Decap's popup handshake: the popup waits for a "hello" message from its
// opener (the admin page), then replies with the token in the exact
// "authorization:github:<status>:<json>" format Decap's postMessage
// listener expects.
function renderResult(status: 'success' | 'error', payload: string): Response {
  const message =
    status === 'success'
      ? `authorization:github:success:${JSON.stringify({ token: payload, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify({ message: payload })}`;

  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
