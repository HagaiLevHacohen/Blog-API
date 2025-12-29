import styles from "../styles/Error.module.css";

export default function Error({ message }) {
  return <div className={styles.error}>{message || "Something went wrong."}</div>;
}
