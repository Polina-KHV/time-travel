import styles from "./style.module.scss";

export function Title() {
  return (
    <div className={styles.container}>
      <div className={styles.line} />
      <h1 className={styles.title}>Исторические даты</h1>
    </div>
  );
}
