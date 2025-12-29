import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "./context/AuthContext";
import styles from "../styles/Home.module.css";
import "../index.css";
import Loading from "./Loading";
import Error from "./Error";

export default function Home() {
  const { token, isLoggedIn } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isLoggedIn);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    fetch("http://localhost:3000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [isLoggedIn, token]);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>
        Welcome to Nightlog
      </h1>
      <p className={styles.subtitle}>
        {isLoggedIn
          ? `Glad to see you back, ${user?.username || "friend"}!`
          : "Your personal space to write and read amazing posts."}
      </p>

      {!isLoggedIn && (
        <div className={styles.buttons}>
          <Link to="/login" className={styles.button}>
            Login
          </Link>
          <Link to="/signup" className={styles.button}>
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}