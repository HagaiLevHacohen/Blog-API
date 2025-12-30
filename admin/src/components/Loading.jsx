import styles from "../styles/Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>Loading...</span>
    </div>
  );
}