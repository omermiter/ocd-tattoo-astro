import site from '../data/site.json';

export const WHATSAPP_NUMBER = site.contact.whatsappNumber;

export const INSTAGRAM_HANDLE = site.contact.instagramHandle;
export const INSTAGRAM_URL = site.contact.instagramUrl;
export const LOCATION = site.contact.location;

export const CONTACT_ENDPOINT = 'https://ocd-tattoo-contact.omer3107.workers.dev';

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function claimMessage(serial: string, title: string): string {
  return `I want to claim ${serial} — ${title}. I saw it on the Register.`;
}
