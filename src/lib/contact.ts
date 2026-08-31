export const WHATSAPP_NUMBER = '972544409502';

export const INSTAGRAM_HANDLE = '@ocd_tattoo';
export const INSTAGRAM_URL = 'https://instagram.com/ocd_tattoo';

export const CONTACT_ENDPOINT = 'https://ocd-tattoo-contact.omer3107.workers.dev';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function claimMessage(serial: string, title: string): string {
  return `I want to claim ${serial} — ${title}. I saw it on the Register.`;
}
