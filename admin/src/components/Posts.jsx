import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostPreview from "./PostPreview";
import { useAuth } from "./context/AuthContext";
import styles from "../styles/Posts.module.css";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

export default function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      // Remove deleted post from state
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Latest Posts</h1>

        <Link to="/posts/new" className={styles.newPostButton}>
          + New Post
        </Link>
      </div>

      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.state}>No posts available.</p>
        ) : (
          posts.map((post) => (
            <PostPreview
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
