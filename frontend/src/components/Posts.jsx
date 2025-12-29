import { useEffect, useState } from "react";
import PostPreview from "./PostPreview";
import styles from "../styles/Posts.module.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Latest Posts</h1>

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
