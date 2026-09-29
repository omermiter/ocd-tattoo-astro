// A minimal classnames joiner — this project has no Tailwind, so there's
// nothing for a tailwind-merge-style conflict resolver to resolve; this is
// just the plain "join truthy class names" half of the usual cn() helper.
type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    out.push(String(v));
  };
  inputs.forEach(walk);
  return out.join(' ');
}
