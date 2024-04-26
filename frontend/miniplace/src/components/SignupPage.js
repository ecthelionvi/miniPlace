import axios from "axios";
import "../styles/SignupPage.css";
// import "../styles/Fonts.css";
import logo from "../images/logo.png";
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const SignupPage = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/register", {
        email,
        password,
      });
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-form-container">
      <div className="close-button-container">
        <NavLink to="/" className="close-button">
          <span>×</span>
        </NavLink>
      </div>
      <div className="signup-form-wrapper">
        <div className="signup-form-content">
          <img src={logo} alt="miniPlace Logo" className="signup-form-logo" />
          <h2 className="signup-form-title">Create Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form-group">
              <label htmlFor="email" className="signup-form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="signup-form-input"
              />
            </div>
            <div className="signup-form-group">
              <label htmlFor="password" className="signup-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="signup-form-input"
              />
            </div>
            <button type="submit" className="signup-form-button">
              Sign Up
            </button>
          </form>
          <p className="signup-form-message">{message}</p>
        </div>
        <div className="signup-form-login-section">
          <p className="signup-form-login-text">Already have an account?</p>
          <NavLink to="/login" className="signup-form-login-link">
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
