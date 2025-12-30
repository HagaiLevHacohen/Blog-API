import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Comment from "./Comment";
import styles from "../styles/Post.module.css";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "./context/AuthContext";

export default function Post() {
  const { postId } = useParams();
  const { token } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [formErrors, setFormErrors] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setRequestError(err.message);
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [postId, token]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setRequestError(err.message);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setRequestError("");
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          published: post.published,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors && data.errors.length > 0) {
          setFormErrors(data.errors.map((err) => err.msg));
        } else {
          setRequestError(data.message || "Failed to save post");
        }
        return;
      }

      alert("Post saved successfully!");
    } catch (err) {
      setRequestError(err.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loadingPost) return <Loading />;
  if (requestError) return <ErrorMessage message={requestError} />;
  if (!post) return null;

  return (
    <article className={styles.container}>
      <form className={styles.form} onSubmit={handleSave}>
        {formErrors.length > 0 && (
          <div className={styles.formError}>
            {formErrors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <label className={styles.label}>
          Title
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Content
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className={styles.textarea}
            rows={10}
          />
        </label>

        <label className={styles.switchLabel}>
          <input
            type="checkbox"
            checked={post.published}
            onChange={() => setPost({ ...post, published: !post.published })}
          />
          {post.published ? "Published" : "Unpublished"}
        </label>

        <button type="submit" className={styles.submitButton} disabled={saving}>
          {saving ? "Saving..." : "Save Post"}
        </button>
      </form>

      <section className={styles.commentsSection}>
        <h2>Comments</h2>

        {loadingComments ? (
          <Loading />
        ) : comments.length === 0 ? (
          <p className={styles.noComments}>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={() => handleCommentDelete(comment.id)}
            />
          ))
        )}
      </section>
    </article>
  );
}
