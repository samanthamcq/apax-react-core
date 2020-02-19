export const SET_USER_TOKEN = 'SET_USER_TOKEN';
export const LOAD_USER = 'LOAD_USER';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_ERROR = 'LOAD_USER_ERROR';
export const LOGIN = 'LOGIN';
export const SIGNUP = 'SIGNUP';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export const setUserToken = (token) => {
  return {
    type: SET_USER_TOKEN,
    token,
  };
};

export const login = (formData, history) => {
  return {
    type: LOGIN,
    formData,
    history,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const signup = (formData, history) => {
  return {
    type: SIGNUP,
    formData,
    history,
  };
};