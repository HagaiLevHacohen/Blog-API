import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/NewPostForm.module.css";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "./context/AuthContext";

export default function NewPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formErrors, setFormErrors] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = { title, content, published };

    setFormErrors([]);
    setRequestError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/admin/posts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors && data.errors.length > 0) {
          setFormErrors(data.errors.map((err) => err.msg));
        } else {
          setRequestError(data.message || "Post creation failed");
        }
        return;
      }

      // Success
      setTitle("");
      setContent("");
      setPublished(false);
      navigate("/posts");
    } catch (err) {
      setRequestError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (requestError) return <ErrorMessage message={requestError} />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
        />
      </label>

      <label className={styles.label}>
        Content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textarea}
          rows={10}
          placeholder="Write your post here..."
        />
      </label>

      <label className={styles.switchLabel}>
        <input
          type="checkbox"
          checked={published}
          onChange={() => setPublished(!published)}
        />
        {published ? "Published" : "Unpublished"}
      </label>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
