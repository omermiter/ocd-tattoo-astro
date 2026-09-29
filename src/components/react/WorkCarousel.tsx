import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './WorkCarousel.module.css';

export interface WorkCarouselItem {
  src: string;
  title: string;
}

interface Props {
  items: WorkCarouselItem[];
  locale?: 'en' | 'he';
}

// A fanned 3D coverflow of the gallery — one carousel for every viewport
// (replaced an earlier split design: a plain CSS grid on desktop, a
// separate WebGL shader carousel gated to mobile only). Ported from a
// Tailwind/Next.js/shadcn showcase demo: Swiper's coverflow engine and
// drag/swipe/loop physics are kept as-is, everything else (the demo's own
// "Card Carousel" title/badge chrome, next/image, the duplicated slide
// list, Tailwind classes) was stripped or replaced — see
// WorkCarousel.module.css for the reskin.
export function WorkCarousel({ items, locale = 'en' }: Props) {
  const [autoplayDelay, setAutoplayDelay] = useState<number | false>(3200);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoplayDelay(false);
  }, []);

  return (
    <div className={styles.root}>
      <Swiper
        dir={locale === 'he' ? 'rtl' : 'ltr'}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        className={styles.swiper}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        spaceBetween={24}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
        pagination={{ type: 'fraction' }}
        navigation
        autoplay={autoplayDelay ? { delay: autoplayDelay, disableOnInteraction: false } : false}
      >
        {items.map((item) => (
          <SwiperSlide key={item.src} className={styles.slide}>
            <div className={styles.frame}>
              <img src={item.src} alt={item.title} loading="lazy" />
            </div>
            <p className={`${styles.caption} data`}>{item.title}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
