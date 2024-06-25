import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setToken } from '../actions/authActions';
import { Navigate } from 'react-router-dom';
import { LOGIN_URL } from '../utils/url_container';
import axios from 'axios';



const Login = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
    const body = { username, password };
    console.log(body);
    const res = await axios.post(LOGIN_URL, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    console.log(res);
    const token = res.data.access_token;
    dispatch(loginSuccess());
    dispatch(setToken(token));
}
catch(err){
  console.log(err);
}
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <div className='login-container'>
      <h1>Login</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className='input-group'>
        <label>
          Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        
        </div>
        <br />
        <div className='input-group'>
        <label>
          Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login;