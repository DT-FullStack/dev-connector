import { CLEAR_PROFILE, PROFILE_SAVED, GET_PROFILE, PROFILE_ERROR, GET_PROFILES, GET_REPOS } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
}

const profileReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case PROFILE_SAVED:
      return { ...state, profile: payload, loading: false };
    case GET_PROFILES:
      return { ...state, profiles: payload, loading: false }
    case PROFILE_ERROR:
      return { ...state, profile: null, error: payload, loading: false };
    case CLEAR_PROFILE:
      return { ...state, profile: null, loading: false };
    case GET_REPOS:
      return { ...state, repos: payload, loading: false }
    default:
      return state;
  }
}

export default profileReducer;