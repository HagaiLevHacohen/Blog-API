import { Outlet, Link, useNavigate } from "react-router";
import styles from "../styles/App.module.css";
import { useAuth } from "./context/AuthContext";
import "../index.css";

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.brand}>
            Nightlog
          </Link>
          <div className={styles.links}>
            {!isLoggedIn && (
              <Link to="/" className={styles.link}>
                Login
              </Link>
            )}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
