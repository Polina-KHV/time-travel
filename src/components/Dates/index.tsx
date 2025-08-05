import { DatesProvider } from "../../contexts/DatesContext";
import { Carousel } from "../Carousel";
import { DatePicker } from "../DatePicker";
import styles from "./style.module.scss";

export function Dates() {
  return (
    <DatesProvider>
      <div className={styles.container}>
        <DatePicker />
        <Carousel type="desktop" />
      </div>
    </DatesProvider>
  );
}
