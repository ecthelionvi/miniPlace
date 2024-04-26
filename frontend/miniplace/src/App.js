import Home from "./components/Home";
import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const sessionLoggedIn = sessionStorage.getItem("loggedIn");
    return sessionLoggedIn === "true";
  });

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  const handleLogin = (userId) => {
    setLoggedIn(true);
    setUserId(userId);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
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
