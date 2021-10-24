import axios from 'axios';
import { setAlert } from './alert';
import {
  PROFILE_SAVED,
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  PROFILE_DELETED,
  GET_PROFILES,
  GET_REPOS
} from './types';

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors && errors.length > 0) dispatch(setAlert(errors[0].msg, 'danger'));
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}

export const getProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE })
  try {
    const res = await axios.get('/api/profile');
    dispatch({ type: GET_PROFILES, payload: res.data })
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}
export const getProfileByUserId = (userId) => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);
    dispatch({ type: GET_PROFILE, payload: res.data })
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}
export const getGithubRepos = (userName) => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${userName}`);
    dispatch({ type: GET_REPOS, payload: res.data })
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}

/**
 * @description passing in `history` allows you to redirect or change pop history state within the action
 */
export const createProfile = (profile, history, edit = false) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.post('/api/profile', profile, config);
    dispatch({ type: PROFILE_SAVED, payload: res.data });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    if (!edit) history.push('/dashboard');
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}

export const addExperience = (experience, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.put('/api/profile/experience', experience, config);
    dispatch({ type: PROFILE_SAVED, payload: res.data });
    dispatch(setAlert('Experience saved', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}

export const addEducation = (education, history) => async dispatch => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const res = await axios.put('/api/profile/education', education, config);
    dispatch({ type: PROFILE_SAVED, payload: res.data });
    dispatch(setAlert('Education saved', 'success'));
    history.push('/dashboard');
  } catch (err) {
    const { statusText: msg, status } = err.response;
    const { errors } = err.response.data;
    if (errors) {
      for (let error of errors) { dispatch(setAlert(error.msg, 'danger')); }
    }
    dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
  }
}
// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api//profile/experience/${id}`);
    dispatch({ type: PROFILE_SAVED, payload: res.data });
    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
  }
};

// Delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api//profile/education/${id}`);
    dispatch({ type: PROFILE_SAVED, payload: res.data });
    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({ type: PROFILE_ERROR, payload: { msg: err.response.statusText, status: err.response.status } });
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: PROFILE_DELETED });

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
