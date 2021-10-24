import { combineReducers } from "redux";
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';

/**
 * After an action is dispatched, these `reducers` return the new `state` of the app
 */
export default combineReducers({
  alert, auth, profile, post
});