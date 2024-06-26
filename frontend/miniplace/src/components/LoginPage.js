import axios from "axios";
import "../styles/LoginPage.css";
import logo from "../images/logo.png";
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      const { userId } = response.data;
      onLogin(userId);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="login-form-container">
      <div className="close-button-container">
        <NavLink to="/" className="close-button">
          <span>×</span>
        </NavLink>
      </div>
      <div className="login-form-wrapper">
        <div className="login-form-content">
          <img src={logo} alt="miniPlace Logo" className="login-form-logo" />
          <h2 className="login-form-title">Sign In</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-form-input"
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-form-input"
              />
            </div>
            <button type="submit" className="login-form-button">
              Sign In
            </button>
          </form>
          <p className="login-form-message">{message}</p>
        </div>
        <div className="login-form-signup-section">
          <p className="login-form-signup-text">new to miniPlace?</p>
          <NavLink to="/signup" className="login-form-signup-button">
            Sign Up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
