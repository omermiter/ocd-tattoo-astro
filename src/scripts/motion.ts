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

    // Center-focus carousel (cynx.io-inspired): whichever card's center is
    // nearest the track's center is "active" (full strength — see the
    // .work-item.is-active CSS), everything else sits dimmed. Tracked on
    // every scroll regardless of source (drag, wheel, touch, or the GSAP
    // snap tween below all dispatch native 'scroll'), rAF-throttled since
    // scroll fires far more often than a frame needs.
    const items = Array.from(el.querySelectorAll<HTMLElement>('.work-item'));
    const nearestIndex = () => {
      const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };
    const setActive = () => {
      const idx = nearestIndex();
      items.forEach((item, i) => item.classList.toggle('is-active', i === idx));
    };
    let activeRaf = 0;
    el.addEventListener(
      'scroll',
      () => {
        if (activeRaf) return;
        activeRaf = requestAnimationFrame(() => {
          setActive();
          activeRaf = 0;
        });
      },
      { passive: true },
    );
    setActive();

    // Mouse-drag release and wheel-idle both get a custom GSAP-eased snap
    // to whichever card is nearest center, instead of leaving it to the
    // browser's own scroll-snap timing — that's the "buttery" part of the
    // cynx.io feel. Touch swipe is left to native momentum + the CSS
    // scroll-snap-align: center fallback: layering a second animation on
    // top of the platform's own fling physics fights it instead of adding
    // to it. scrollIntoView (not manual offsetLeft math) finds the target,
    // since it already gets the RTL negative-range scrollLeft model right.
    const snapToNearest = () => {
      const item = items[nearestIndex()];
      if (!item) return;
      const from = el.scrollLeft;
      item.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
      const to = el.scrollLeft;
      el.scrollLeft = from;
      if (Math.abs(to - from) < 0.5) return;
      gsap.to(el, { scrollLeft: to, duration: 0.6, ease: 'power3.out' });
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
      gsap.killTweensOf(el); // a fresh grab always wins over an in-flight snap-back
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
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      snapToNearest();
    };
    el.addEventListener('pointerup', stopDrag);
    el.addEventListener('pointercancel', stopDrag);

    let wheelIdleTimer = 0;
    el.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // trackpad horizontal swipe: let it through natively
        if (el.scrollWidth <= el.clientWidth) return; // nothing to scroll

        // Only hijack the wheel tick while there's actually another card
        // left to reach in that direction — otherwise it's an infinite
        // trap: every tick gets swallowed into a horizontal scroll that
        // goes nowhere, and preventDefault blocks the page from ever
        // continuing past the strip. Once the nearest-to-center card is
        // the first/last one, let the same tick fall through to the page
        // as normal vertical scroll instead.
        // Index-based, not a raw scrollLeft/max comparison: centering the
        // edge cards (see padding-inline above) means the true scroll
        // extent reaches past their centered snap position, so comparing
        // scrollLeft to scrollWidth-clientWidth would trap the page
        // exactly like the bug this replaced. "Which card is nearest"
        // doesn't have that problem, and is direction-agnostic by
        // construction — no RTL branching needed here either.
        const forward = e.deltaY > 0;
        const idx = nearestIndex();
        const atStart = idx === 0;
        const atEnd = idx === items.length - 1;
        if ((forward && atEnd) || (!forward && atStart)) return;

        gsap.killTweensOf(el); // a fresh tick always wins over an in-flight snap-back
        e.preventDefault();
        el.scrollLeft += pageIsRtl ? -e.deltaY : e.deltaY;
        dismissHint();

        window.clearTimeout(wheelIdleTimer);
        wheelIdleTimer = window.setTimeout(snapToNearest, 150);
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
