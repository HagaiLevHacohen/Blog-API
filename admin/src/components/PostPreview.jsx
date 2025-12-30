import { Link } from "react-router-dom";
import styles from "../styles/PostPreview.module.css";

export default function PostPreview({ post, onDelete }) {
  const MAX_LENGTH = 200;

  const previewText =
    post.content && post.content.length > MAX_LENGTH
      ? post.content.slice(0, MAX_LENGTH) + "..."
      : post.content;

  return (
    <div className={styles.cardWrapper}>
      <Link to={`/posts/${post.id}/edit`} className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{post.title}</h3>

          <span
            className={`${styles.status} ${
              post.published ? styles.published : styles.unpublished
            }`}
          >
            {post.published ? "Published" : "Unpublished"}
          </span>
        </div>

        <p className={styles.content}>
          {previewText || "No content available."}
        </p>

        <div className={styles.meta}>
          <span>By {post.user.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </Link>

      <button className={styles.deleteButton} onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
