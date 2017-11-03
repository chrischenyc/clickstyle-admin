import { createStore, combineReducers } from 'redux';
import user from './user';
import profile from './profile';

const reducer = combineReducers({
  user,
  profile,
});

/* eslint-disable no-underscore-dangle */
export default createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */
