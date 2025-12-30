import styles from "../styles/Comment.module.css";

export default function Comment({ comment, onDelete }) {
  return (
    <div className={styles.comment}>
      <p className={styles.content}>{comment.content}</p>

      <div className={styles.meta}>
        <span className={styles.author}>{comment.user.username}</span>
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        <button className={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
