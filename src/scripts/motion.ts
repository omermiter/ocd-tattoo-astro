import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageIsRtl = document.documentElement.dir === 'rtl';

const RTL_CHAR = /[֐-׿؀-ۿ]/;
const LTR_CHAR = /[A-Za-z]/;

// Hand-rolled instead of GSAP SplitText: once letters become inline-blocks,
// the bidi algorithm treats them as neutral, so a Latin phrase inside an RTL
// page (or vice versa) would render its words in reverse order. Returns null
// for any element containing text that runs against the page direction; the
// caller animates that element whole instead.
function splitChars(el: HTMLElement): HTMLElement[] | null {
  const text = el.textContent ?? '';
  if (pageIsRtl ? LTR_CHAR.test(text) : RTL_CHAR.test(text)) return null;

  const segmenter = 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = (s: string) => (segmenter ? Array.from(segmenter.segment(s), (g) => g.segment) : Array.from(s));
  const chars: HTMLElement[] = [];

  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
        continue;
      }
      if (child.nodeType !== Node.TEXT_NODE) continue;
      const frag = document.createDocumentFragment();
      for (const token of (child.textContent ?? '').split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          frag.append(token);
          continue;
        }
        const word = document.createElement('span');
        word.className = 'split-word';
        word.setAttribute('aria-hidden', 'true');
        for (const g of graphemes(token)) {
          const c = document.createElement('span');
          c.className = 'split-char';
          c.textContent = g;
          word.append(c);
          chars.push(c);
        }
        frag.append(word);
      }
      child.replaceWith(frag);
    }
  };

  // role="text" (a de-facto, widely-supported convention, not a formal
  // ARIA role) is what makes aria-label valid on a plain <p>/<span>/etc.
  // per the ARIA-in-HTML spec — its default role doesn't support an
  // author-supplied accessible name, which is what Lighthouse's
  // "prohibited ARIA attributes" audit flags. A heading's implicit
  // role="heading" already supports aria-label natively, and overriding
  // it here would drop the element out of the page's heading outline —
  // Lighthouse's "accessibility tree is not well-formed" audit flags
  // that instead. Every individual .split-char span stays aria-hidden,
  // so aria-label (on whichever role the element already has) is the
  // only accessible name for the whole phrase either way.
  if (!/^H[1-6]$/.test(el.tagName)) el.setAttribute('role', 'text');
  el.setAttribute('aria-label', text.trim());
  walk(el);
  return chars;
}

function heroIntro() {
  const title = document.querySelector<HTMLElement>('[data-split="hero"]');
  if (!title) return;
  const chars = splitChars(title);
  const targets = chars ?? [title];
  gsap.set(targets, { opacity: 0, yPercent: 45, rotation: chars ? 6 : 0 });
  gsap.set(title, { opacity: 1 });

  const play = () =>
    gsap.to(targets, {
      opacity: 1,
      yPercent: 0,
      rotation: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.028,
    });

  // Wait for the preloader to clear so the reveal isn't spent behind it.
  if (!document.querySelector('[data-preloader]') || document.documentElement.dataset.intro === 'done') play();
  else window.addEventListener('ocd:intro', play, { once: true });
}

// Letters rise into place once the heading reaches the lower half of the
// viewport, and settle back out if you scroll back up past it.
//
// Deliberately NOT a continuous scroll-scrub (that was the original
// implementation, and it was broken): with a per-character stagger, a
// scrubbed tween's progress is bound to scroll position through a lagged
// "catch-up" tween, so each character — offset from the next by `stagger`
// — ends up resolved against a slightly different moment of that lag.
// Scroll at anything like normal speed and the catch-up tween never
// finishes before you're past the trigger's `end`, leaving characters
// permanently stuck mid-transform (tilted, half-opacity, sunk below the
// baseline) instead of settling — reproduced live on both the feature
// strip labels and every piece title. A toggled play/reverse instead runs
// each character's tween to full, guaranteed completion once it starts,
// independent of scroll speed.
function scrubHeadings() {
  document.querySelectorAll<HTMLElement>('[data-split="scrub"]').forEach((el) => {
    const chars = splitChars(el);
    gsap.fromTo(
      chars ?? el,
      { opacity: 0, yPercent: 60, rotation: chars ? 8 : 0 },
      {
        opacity: 1,
        yPercent: 0,
        rotation: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: chars ? 0.04 : 0,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      },
    );
  });
}

// Accent lines that draw themselves in with scroll. Driven through a CSS
// custom property (default 1 in CSS), so with no JS the lines just render.
function growLines() {
  document.querySelectorAll<HTMLElement>('[data-grow-line]').forEach((el) => {
    gsap.fromTo(
      el,
      { '--line-scale': 0 },
      {
        '--line-scale': 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.8, fastScrollEnd: true },
      },
    );
  });
}

// Photos open out of a smaller frame as they enter, the image settling from
// a slight zoom — the "preview card scales up" beat, kept to real work.
function openFrames() {
  document.querySelectorAll<HTMLElement>('[data-frame-reveal]').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 45%', scrub: 0.8, fastScrollEnd: true },
    });
    tl.fromTo(frame, { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
    tl.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
  });
}

function parallaxBreak() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -8, scale: 1.2 },
      {
        yPercent: 8,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

if (!reduced) {
  heroIntro();
  scrubHeadings();
  growLines();
  openFrames();
  parallaxBreak();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
