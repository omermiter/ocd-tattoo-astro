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

// Letters rise into place as the heading scrolls through the lower half of
// the viewport — scrubbed, so scrolling back up plays it in reverse.
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
        ease: 'power2.out',
        stagger: chars ? 0.04 : 0,
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 0.8 },
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
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.8 },
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
      scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 45%', scrub: 0.8 },
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

// Horizontal scroller (the More Work strip). Native touch swipe and
// scrollbar-drag already work on any overflow-x element with zero JS below
// — this only adds what a plain mouse can't do on its own: click-and-drag,
// and treating an ordinary vertical wheel scroll as horizontal while
// hovering the strip. Runs regardless of prefers-reduced-motion — this is
// user-driven interaction, not autoplaying motion.
function dragScroll() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  document.querySelectorAll<HTMLElement>('[data-drag-scroll]').forEach((el) => {
    const hint = el.closest('.more-work')?.querySelector<HTMLElement>('[data-drag-hint]');
    let dismissHint = () => {
      hint?.classList.add('is-hidden');
      dismissHint = () => {};
    };

    // Cursor-follow badge — mouse/trackpad only; touch already gets the
    // static pill hint above and has no hover to follow anyway. Same
    // lerp-follow technique as the site's pixel-art cursor (Cursor.astro),
    // and it takes over from that cursor for as long as it's shown instead
    // of the two overlapping (see html[data-drag-hover] in pixel-art.css).
    const badge = el.querySelector<HTMLElement>('[data-drag-badge]');
    if (badge && finePointer) {
      const LERP = 0.35;
      let targetX = 0;
      let targetY = 0;
      let x = 0;
      let y = 0;
      let raf = 0;
      let active = false;
      const half = badge.offsetWidth / 2 || 46;

      const tick = () => {
        x += (targetX - x) * LERP;
        y += (targetY - y) * LERP;
        badge.style.transform = `translate(${x - half}px, ${y - half}px)`;
        if (active || Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      };

      const start = () => {
        active = true;
        document.documentElement.setAttribute('data-drag-hover', 'true');
        badge.classList.add('is-visible');
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const move = (e: PointerEvent) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!active) {
          x = targetX;
          y = targetY;
          start();
        }
      };
      const stop = () => {
        active = false;
        document.documentElement.removeAttribute('data-drag-hover');
        badge.classList.remove('is-visible');
      };

      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        move(e);
      });
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        move(e);
      });
      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        stop();
      });
      el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') stop(); // dragging: get out of the way
      });
    }

    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return; // touch/pen already scroll natively
      dragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
      dismissHint();
    });

    const stopDrag = () => {
      dragging = false;
      el.classList.remove('is-dragging');
    };
    el.addEventListener('pointerup', stopDrag);
    el.addEventListener('pointercancel', stopDrag);

    el.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpad horizontal swipe: let it through natively
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return; // nothing to scroll

        // Only hijack the wheel tick while there's actually room left to
        // move in that direction — otherwise it's an infinite trap: every
        // tick gets swallowed into a horizontal scroll that goes nowhere,
        // and preventDefault blocks the page from ever continuing past the
        // strip. Once an edge is reached, let the same tick fall through to
        // the page as normal vertical scroll, exactly like scrolling past
        // any other element.
        // RTL: scrollLeft runs 0 (start/right) to -max (end/left), the
        // mirror of LTR — "scrolling down" still means "move forward
        // through the strip" either way, so forward doesn't flip on
        // direction; only the scrollLeft delta below does.
        const forward = e.deltaY > 0;
        const atStart = pageIsRtl ? el.scrollLeft >= -0.5 : el.scrollLeft <= 0.5;
        const atEnd = pageIsRtl ? el.scrollLeft <= -max + 0.5 : el.scrollLeft >= max - 0.5;
        if ((forward && atEnd) || (!forward && atStart)) return;

        e.preventDefault();
        el.scrollLeft += pageIsRtl ? -e.deltaY : e.deltaY;
        dismissHint();
      },
      { passive: false },
    );

    // A bare 'scroll' listener here was too eager: browsers sometimes fire
    // one on this element for incidental reasons that aren't the visitor
    // actually using it — landing directly on a #gallery-anchored URL was
    // enough to trigger it, dismissing the hint before anyone had touched
    // anything. Only counts as real once scrollLeft has moved a real
    // distance, which still correctly covers native touch swipe, dragging
    // the scrollbar, and keyboard arrow-key scroll on the focused region.
    let lastScrollLeft = el.scrollLeft;
    const onNativeScroll = () => {
      if (Math.abs(el.scrollLeft - lastScrollLeft) > 4) {
        dismissHint();
        el.removeEventListener('scroll', onNativeScroll);
      }
      lastScrollLeft = el.scrollLeft;
    };
    el.addEventListener('scroll', onNativeScroll, { passive: true });
  });
}

dragScroll();

if (!reduced) {
  heroIntro();
  scrubHeadings();
  growLines();
  openFrames();
  parallaxBreak();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
