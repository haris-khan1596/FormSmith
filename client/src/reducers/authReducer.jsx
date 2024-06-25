import { LOGIN_SUCCESS, LOGOUT, SET_TOKEN, CLEAR_TOKEN } from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true };
    case LOGOUT:
      return { ...state, isAuthenticated: false, token: null };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case CLEAR_TOKEN:
      return { ...state, token: null };
    default:
      return state;
  }
};

export default authReducer;
