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
      try {
        const res = await fetch("http://localhost:3000/admin/posts",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
            <PostPreview key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
