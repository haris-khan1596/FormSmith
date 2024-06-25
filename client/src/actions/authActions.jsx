export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_TOKEN = 'SET_TOKEN';
export const CLEAR_TOKEN = 'CLEAR_TOKEN';

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS,
});

export const logout = () => ({
  type: LOGOUT,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const clearToken = () => ({
  type: CLEAR_TOKEN,
});
