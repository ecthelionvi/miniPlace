import Home from "./components/Home";
import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const userId = sessionStorage.getItem("userId");
    return !!userId;
  });

  const [userId, setUserId] = useState(() => {
    return sessionStorage.getItem("userId");
  });

  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
    sessionStorage.setItem("userId", userId);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
    sessionStorage.removeItem("userId");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              loggedIn={loggedIn}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              userId={userId}
            />
          }
        />
        <Route path="/login" element={<LoginPage loggedIn={loggedIn} onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage loggedIn={loggedIn} onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
