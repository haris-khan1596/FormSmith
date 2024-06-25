import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, clearToken } from '../actions/authActions';

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearToken());
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Token: {token}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
