export interface GoogleReview {
  authorName: string;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  reviews: GoogleReview[];
}

const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * Fetches real Google reviews at BUILD TIME — Astro frontmatter runs in
 * Node during `astro build` (see .github/workflows/deploy.yml), not in the
 * browser. This is a static site with no server, so baking the response
 * into the static HTML is what keeps the API key off the client: it's read
 * once during the GitHub Actions build and never shipped to a browser.
 *
 * Requires GOOGLE_PLACES_API_KEY as a build-time secret (see .env.example
 * and README) with the legacy "Places API" enabled on the key. A missing
 * key, a failed request, or a malformed response all resolve to `null` —
 * this function never throws and never invents review content. A build
 * without the secret configured still succeeds; the reviews section
 * renders its no-data fallback (a plain link to the Google listing)
 * instead of empty stars or placeholder text.
 */
export async function fetchGoogleReviews(placeId: string): Promise<GoogleReviewsData | null> {
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.warn('[googleReviews] GOOGLE_PLACES_API_KEY not set at build time — reviews section will use its no-data fallback.');
    return null;
  }

  try {
    const url = new URL(PLACE_DETAILS_URL);
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
    url.searchParams.set('key', apiKey);

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[googleReviews] Places API request failed with status ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json.status !== 'OK' || !json.result) {
      // error_message is Google's own diagnostic text (e.g. why a key was
      // denied) — never sensitive (it doesn't echo the key back), so it's
      // safe to log in CI output.
      const reason = json.error_message ? ` — ${json.error_message}` : '';
      console.warn(`[googleReviews] Places API returned status "${json.status}"${reason}`);
      return null;
    }

    const result = json.result as {
      rating?: number;
      user_ratings_total?: number;
      reviews?: Array<{ author_name: string; rating: number; relative_time_description: string; text: string }>;
    };

    if (typeof result.rating !== 'number' || typeof result.user_ratings_total !== 'number') {
      return null;
    }

    // Google's Place Details (legacy) API returns AT MOST 5 reviews total,
    // chosen by Google's own "most relevant" ranking — there is no way to
    // fetch every review on the profile through this endpoint, only filter
    // within whatever five it hands back. Keep all of those, filtered to
    // 4★ and 5★ only per Omer's request. Real text, real names, real
    // ratings only; never rewritten.
    const reviews: GoogleReview[] = (result.reviews ?? [])
      .filter((r) => r.rating >= 4)
      .map((r) => ({
        authorName: r.author_name,
        rating: r.rating,
        relativeTime: r.relative_time_description,
        text: r.text,
      }));

    return {
      rating: result.rating,
      reviewCount: result.user_ratings_total,
      reviews,
    };
  } catch (err) {
    console.warn('[googleReviews] fetch failed', err);
    return null;
  }
}
