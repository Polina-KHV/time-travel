import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { IDate, useDatesContext } from "../../contexts/DatesContext";
import { Switch } from "../Switch";
import { Title } from "../Title";
import styles from "./style.module.scss";

export function DatePicker() {
  const { dates, setDates, activeDate, setActiveDate, baseAngle } =
    useDatesContext();
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [displayFrom, setDisplayFrom] = useState<number>(dates[0]?.from || 0);
  const [displayTo, setDisplayTo] = useState<number>(dates[0]?.to || 0);
  const animationValues = useRef({ from: displayFrom, to: displayTo });
  const [showTag, setShowTag] = useState(false);

  const positionPointOnCircle = (element: HTMLDivElement, angle: number) => {
    const radius = 265;
    const x = Math.cos(((angle - 90) * Math.PI) / 180) * radius;
    const y = Math.sin(((angle - 90) * Math.PI) / 180) * radius;

    element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  };

  useEffect(() => {
    dates.forEach((point, index) => {
      const element = pointRefs.current[index];
      if (element) {
        positionPointOnCircle(element, point.angle);
      }
    });

    const activePointData = dates.find((p) => p.id === activeDate);
    if (activePointData) {
      setDisplayFrom(activePointData.from);
      setDisplayTo(activePointData.to);
      animationValues.current.from = activePointData.from;
      animationValues.current.to = activePointData.to;
    }
  }, []);

  const handlePointClick = (clickedPoint: IDate) => {
    if (activeDate === clickedPoint.id) return;
    setActiveDate(clickedPoint.id);
    setShowTag(false);

    const targetAngle = baseAngle / 2;
    const currentAngle = clickedPoint.angle;
    let rotationNeeded = targetAngle - currentAngle;

    if (rotationNeeded > 180) rotationNeeded -= 360;
    if (rotationNeeded < -180) rotationNeeded += 360;

    const targetFrom = clickedPoint.from;
    const targetTo = clickedPoint.to;

    gsap.to(animationValues.current, {
      from: targetFrom,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayFrom(Math.floor(animationValues.current.from));
      },
      onComplete: () => {
        setDisplayFrom(targetFrom);
      },
    });

    gsap.to(animationValues.current, {
      to: targetTo,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayTo(Math.floor(animationValues.current.to));
      },
      onComplete: () => {
        setDisplayTo(targetTo);
      },
    });

    const timeline = gsap.timeline();

    dates.forEach((point, index) => {
      const pointElement = pointRefs.current[index];
      if (pointElement) {
        const newAngle = (point.angle + rotationNeeded + 360) % 360;

        const steps = Math.abs(Math.round(rotationNeeded / 10));
        const stepAngle = rotationNeeded / steps;

        const animations = [];

        for (let i = 1; i <= steps; i++) {
          const intermediateAngle = point.angle + stepAngle * i;
          const normalizedAngle = ((intermediateAngle % 360) + 360) % 360;

          animations.push({
            duration: 1 / steps,
            ease: "none",
            onUpdate: () => {
              positionPointOnCircle(pointElement, normalizedAngle);
            },
            onComplete: () => {
              if (i === steps) {
                positionPointOnCircle(pointElement, newAngle);
              }
            },
          });
        }

        if (steps <= 1) {
          timeline.to(
            pointElement,
            {
              duration: 1,
              ease: "none",
              onUpdate: () => {
                const progress = timeline.progress();
                const currentAngle = point.angle + rotationNeeded * progress;
                const normalizedAngle = ((currentAngle % 360) + 360) % 360;
                positionPointOnCircle(pointElement, normalizedAngle);
              },
              onComplete: () => {
                positionPointOnCircle(pointElement, newAngle);
              },
            },
            0
          );
        } else {
          animations.forEach((animation, i) => {
            timeline.to(pointElement, animation, i * (1 / steps));
          });
        }
      }
    });

    timeline.call(() => {
      setDates((prev) =>
        prev.map((p) => ({
          ...p,
          angle: (p.angle + rotationNeeded + 360) % 360,
        }))
      );
      setTimeout(() => setShowTag(true), 300);
    });
  };

  return (
    <div className={styles.container}>
      <Title />
      <div className={styles.line} />
      <h2 className={styles.dates}>
        <span>{displayFrom}</span> <span>{displayTo}</span>
      </h2>
      <div className={styles.circle}>
        {dates.map((point, index) => (
          <div
            key={point.id}
            ref={(el) => {
              pointRefs.current[index] = el;
            }}
            className={`${styles.point} ${
              activeDate === point.id ? styles.active : ""
            }`}
            onClick={() => handlePointClick(point)}
          >
            {point.id}
            {point.tag && activeDate === point.id && (
              <span
                className={`${styles.tag} ${showTag ? styles.visible : ""}`}
              >
                {point.tag}
              </span>
            )}
          </div>
        ))}
      </div>
      <Switch setActiveItem={(point) => handlePointClick(point)} />
    </div>
  );
}
