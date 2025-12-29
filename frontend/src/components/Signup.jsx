import { useState } from "react";
import { Link } from "react-router";
import styles from "../styles/Signup.module.css"; // Note the import

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const newErrors = {};

    // Basic frontend validation similar to your backend
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email must be valid";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    if (formData.confirm_password !== formData.password)
      newErrors.confirm_password = "Password confirmation doesn't match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call your backend API for signup
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error("Signup request failed");
      }

      const data = await res.json();

      if (!data.success) {
        const backendErrors = {};
        if (data.errors) {
          data.errors.forEach((err) => {
            backendErrors[err.param] = err.msg;
          });
        }
        setErrors(backendErrors);
        setMessage(data.message || "Signup failed");
      } else {
        setMessage("Signup successful! You can now log in.");
        setFormData({ username: "", email: "", password: "", confirm_password: "" });
      }
    } catch (err) {
      setMessage("Something went wrong. Try again later.");
      console.error(err);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
        />
        {errors.confirm_password && (
          <p className={styles.error}>{errors.confirm_password}</p>
        )}

        <button type="submit">Sign Up</button>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.footerText}>
          Already Have an Account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
