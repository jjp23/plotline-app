import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="Plotline Logo" className="logo" />
          Plotline
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/about">About</Link>
        <Link to="/search">Search</Link> 
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/add-friends">Add Friends</Link> 
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
