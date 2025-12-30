import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import styles from "../styles/Post.module.css";
import Loading from "./Loading";
import Error from "./Error";

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Fetch comments (with user included)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${postId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentCreated = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loadingPost) return <Loading />;
  if (error) return <Error message={error} />;
  if (!post) return null;

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>By {post.user.username}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      <section className={styles.content}>
        {post.content || "No content available."}
      </section>

      <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />

      <section className={styles.commentsSection}>
        <h2>Comments</h2>

        {loadingComments ? (
          <Loading />
        ) : comments.length === 0 ? (
          <p className={styles.noComments}>No comments yet.</p>
        ) : (
          comments.map((comment) => <Comment key={comment.id} comment={comment} />)
        )}
      </section>
    </article>
  );
}
