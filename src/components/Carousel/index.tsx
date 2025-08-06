import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDatesContext } from "../../contexts/DatesContext";
import styles from "./style.module.scss";

interface ICarousel {
  type: "mobile" | "desktop";
}

export function Carousel({ type }: ICarousel) {
  const { dates, activeDate } = useDatesContext();
  const active = dates.find((d) => d.id === activeDate);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentActive, setCurrentActive] = useState(active);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTag, setActiveTag] = useState<string | undefined>(
    dates.find((d) => d.id == activeDate)?.tag
  );

  const [width, setWidth] = useState<number>(window.innerWidth);

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
        setCurrentSlide(swiperRef.current.activeIndex);
      });

      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
      setCurrentSlide(swiperRef.current.activeIndex || 0);
    }
  }, [currentActive, prevRef, nextRef]);

  useEffect(() => {
    if (!active || !wrapperRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(0.4, () => {
          setCurrentActive(active);
          setActiveTag(dates.find((d) => d.id == activeDate)?.tag);
        });
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

  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, [width]);

  const typeClassName = type == "mobile" ? " " + styles.mobile : "";

  const handleDotClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className={styles.carousel + typeClassName}>
      <button
        ref={prevRef}
        className={styles.arrow + " " + styles.left + typeClassName}
        style={{ visibility: isBeginning ? "hidden" : "visible" }}
      >
        <ChevronLeft className={styles.icon} />
      </button>
      <div ref={wrapperRef} className={styles.wrapper}>
        {type == "mobile" && (
          <span className={styles.tag}>{activeTag || ""}</span>
        )}
        <Swiper
          spaceBetween={width <= 620 ? 25 : width <= 1200 ? 30 : 40}
          slidesPerView={width <= 980 ? "auto" : 3}
          allowTouchMove
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesOffsetBefore={width <= 620 ? 20 : width <= 980 ? 40 : 0}
          className={styles.swiper}
        >
          {currentActive.years.map((item, index) => (
            <SwiperSlide
              key={item.year}
              className={`${styles.item} ${
                currentSlide === index ? styles.active : ""
              }`}
            >
              <h4 className={styles.year}>{item.year}</h4>
              <p className={styles.event}>{item.event}</p>
            </SwiperSlide>
          ))}
        </Swiper>

        {width <= 980 && currentActive && (
          <div className={styles.pagination}>
            {currentActive.years.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  currentSlide === index ? styles.active : ""
                }`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        )}
      </div>
      <button
        ref={nextRef}
        className={styles.arrow + " " + styles.right + typeClassName}
        style={{ visibility: isEnd ? "hidden" : "visible" }}
      >
        <ChevronRight className={styles.icon} />
      </button>
    </div>
  );
}
