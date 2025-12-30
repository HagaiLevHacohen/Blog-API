import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import styles from "../styles/CommentForm.module.css";

export default function CommentForm({ postId, onCommentCreated }) {
  const { token, isLoggedIn } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.errors?.[0]?.msg || "Failed to create comment");
      } else {
        setContent("");
        onCommentCreated(data.comment);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Only show form if user is logged in
  if (!isLoggedIn) {
    return <p className={styles.loginPrompt}>You must be logged in to comment.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={255}
        rows={3}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
