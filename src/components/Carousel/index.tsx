// src/components/Carousel/index.tsx
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDatesContext } from "../../contexts/DatesContext";
import styles from "./style.module.scss";

export function Carousel() {
  const { dates, activeDate } = useDatesContext();
  const active = dates.find((d) => d.id === activeDate);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); // wrapper for animation

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentActive, setCurrentActive] = useState(active);

  useEffect(() => {
    if (
      swiperRef.current &&
      prevRef.current &&
      nextRef.current &&
      swiperRef.current.params
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();

      swiperRef.current.on("slideChange", () => {
        setIsBeginning(swiperRef.current.isBeginning);
        setIsEnd(swiperRef.current.isEnd);
      });

      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [currentActive, prevRef, nextRef]);

  useEffect(() => {
    if (!active || !wrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(0.4, () => setCurrentActive(active));
      },
    });

    tl.to(wrapperRef.current, {
      opacity: 0,
      duration: 0.3,
      pointerEvents: "none",
    });
  }, [activeDate]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      wrapperRef.current,
      {
        opacity: 0,
        pointerEvents: "none",
      },
      {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        pointerEvents: "auto",
      }
    );
  }, [currentActive]);

  if (!currentActive) return null;

  return (
    <div className={styles.carousel}>
      <button
        ref={prevRef}
        className={styles.arrow + " " + styles.left}
        style={{ visibility: isBeginning ? "hidden" : "visible" }}
      >
        <ChevronLeft className={styles.icon} />
      </button>
      <div ref={wrapperRef} className={styles.wrapper}>
        <Swiper
          spaceBetween={40}
          slidesPerView={3}
          allowTouchMove
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className={styles.swiper}
        >
          {currentActive.years.map((item) => (
            <SwiperSlide key={item.year}>
              <article className={styles.item}>
                <h4 className={styles.year}>{item.year}</h4>
                <p className={styles.event}>{item.event}</p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <button
        ref={nextRef}
        className={styles.arrow + " " + styles.right}
        style={{ visibility: isEnd ? "hidden" : "visible" }}
      >
        <ChevronRight className={styles.icon} />
      </button>
    </div>
  );
}
