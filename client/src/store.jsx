import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './reducers';
import { authMiddleware } from './middlewares/authMiddleware';

const store = createStore(rootReducer, applyMiddleware(thunk, authMiddleware));

export default store;

