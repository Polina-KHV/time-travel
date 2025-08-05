import { ChevronLeft, ChevronRight } from "lucide-react";
import { IDate, useDatesContext } from "../../contexts/DatesContext";
import styles from "./style.module.scss";

interface ISwitch {
  setActiveItem: (point: IDate) => void;
}

export function Switch({ setActiveItem }: ISwitch) {
  const { dates, activeDate } = useDatesContext();
  const onBackButtonClick = () => {
    if (activeDate == 1) setActiveItem(dates[dates.length - 1]);
    else {
      const newItem = dates.find((d) => d.id == activeDate - 1);
      if (newItem) setActiveItem(newItem);
    }
  };

  const onNextButtonClick = () => {
    if (activeDate == dates.length) setActiveItem(dates[0]);
    else {
      const newItem = dates.find((d) => d.id == activeDate + 1);
      if (newItem) setActiveItem(newItem);
    }
  };

  return (
    <div className={styles.container}>
      <span>{activeDate < 10 ? `0${activeDate}` : activeDate}/06</span>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={onBackButtonClick}>
          <ChevronLeft />
        </button>
        <button className={styles.button} onClick={onNextButtonClick}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
