import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, clearToken } from '../actions/authActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">FormSmith</Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">My Forms</Link>
        <Link to="/forms/new" className="nav-link">+ New Form</Link>
        <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
