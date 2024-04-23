import Home from "./components/Home";
import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const sessionLoggedIn = sessionStorage.getItem("loggedIn");
    return sessionLoggedIn === "true";
  });

  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home loggedIn={loggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
          }
        />
        <Route path="/login" element={<LoginPage loggedIn={loggedIn} onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
