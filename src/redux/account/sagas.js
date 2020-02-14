import {
    all,
    call,
    put,
    take,
    select,
  } from 'redux-saga/effects';
  import axios from 'axios';
  import Cookies from 'universal-cookie';

  import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR,
    LOAD_USER,
    LOAD_USER_SUCCESS,
    LOAD_USER_ERROR,
    LOGOUT,
  } from './actions';

  import api from '../../utils/api';
  import { getUser, getToken } from '../account/selectors';
  import { minDelayCall } from '../helpers';

  export const TOKEN_COOKIE = '_react_core_token';

  export function* signup (action) {
    const { formData, history } = action;
    try {
      const response = yield minDelayCall(api.signup, formData);

      // Persist token for future page loads
      new Cookies().set(TOKEN_COOKIE, response.key, { path: '/' });

      // Redirect user to home
      history.replace('/');
      yield put({ type: SIGNUP_SUCCESS, ...response });
    } catch (error) {
      yield put({ type: SIGNUP_ERROR, error: error.response.data });
    }
  }

  export function* login (action) {
    const { formData, history } = action;

    try {
      const response = yield minDelayCall(api.login, formData);

      // Persist token for future page loads
      new Cookies().set(TOKEN_COOKIE, response.key, { path: '/' });

      // Redirect user to home
      history.replace('/');
      yield put({ type: LOGIN_SUCCESS, ...response });
    } catch (error) {
      yield put({ type: LOGIN_ERROR, error: error.response.data });
    }
  }

  export function* loadUser (token) {
    // Set user loading
    yield put({ type: LOAD_USER });

    try {
      const user = yield minDelayCall(api.loadUser, token);

      yield put({ type: LOAD_USER_SUCCESS, user, token});
    } catch (error) {
      // Token is bogus. Remove it.
      new Cookies().remove(TOKEN_COOKIE, { path: '/' });

      yield put({ type: LOAD_USER_ERROR });
    }
  }

  // Finite state machine for user session
  export function* loginFlow () {
    while(true) {
      // Check for existing token
      const token = new Cookies().get(TOKEN_COOKIE);

      if (token) {
        // Load the user if we found a token
        yield call(loadUser, token);
      }

      if (!(yield select(getUser))) {
        // Wait for login / signup if we don't have a user
        const action = yield take([LOGIN, SIGNUP]);
        if (action.type === LOGIN) {
          yield call(login, action);
        } else {
          yield call(signup, action);
        }
      }

      if (yield select(getUser)) {
        // Once we have a user, configure axios to always use token
        const newToken = yield select(getToken);
        axios.defaults.headers.common['Authorization'] = `Token ${newToken}`;

        // Wait for logout
        yield take(LOGOUT);
        new Cookies().remove(TOKEN_COOKIE, { path: '/' });
      }
    }
  }