import React, { useState, useEffect } from "react";
import "./AuthForm.css";

const AuthForm = ({ onAuthSuccess }) => {
  // State for managing form mode (login or signup)
  const [isLogin, setIsLogin] = useState(true);

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // State for error messages
  const [error, setError] = useState("");

  // State for storing user data
  const [users, setUsers] = useState([]);

  // Load users from local storage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Check if user exists and password matches
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      console.log("Logged in successfully");
      setEmail("");
      setPassword("");
      // Call the onAuthSuccess callback to update app state
      if (typeof onAuthSuccess === "function") {
        onAuthSuccess();
      }
    } else {
      setError(
        "Invalid email or password. Please sign up if you don't have an account."
      );
    }
  };

  // Handle signup form submission
  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      setError("An account with this email already exists.");
      return;
    }

    // Create new user and add to users array
    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Save updated users to local storage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    console.log("Signed up successfully");
    // Clear form fields
    setName("");
    setEmail("");
    setPassword("");
    // Show success message and switch to login view
    setError("Account created successfully. Please log in.");
    setIsLogin(true);
  };

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {/* Only show name field for signup */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        {/* Toggle between login and signup */}
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
