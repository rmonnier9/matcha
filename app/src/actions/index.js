import axios from 'axios';
import callApi from '../callApi.js';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const INIT_NOTIFICATIONS_NUMBER = 'INIT_NOTIFICATIONS_NUMBER';

const requestLogin = (creds) => ({
  type: LOGIN_REQUEST,
  isFetching: true,
  isAuthenticated: false,
  creds,
});

const receiveLogin = (id_token) => ({
  type: LOGIN_SUCCESS,
  isFetching: false,
  isAuthenticated: true,
  id_token,
});

const loginError = (message) => ({
  type: LOGIN_FAILURE,
  isFetching: false,
  isAuthenticated: false,
  message,
});

const requestLogout = () => ({
  type: LOGOUT_REQUEST,
  isFetching: true,
  isAuthenticated: true,
});

const receiveLogout = () => ({
  type: LOGOUT_SUCCESS,
  isFetching: false,
  isAuthenticated: false,
});
;
const receiveNotification = (message, level) => ({
  type: ADD_NOTIFICATION,
  message,
  level,
});

const unreadNotificationsNumber = (number) => ({
  type: INIT_NOTIFICATIONS_NUMBER,
  number,
});

const initNotificationsNumber = () => {
  return (dispatch) => {
    const url = '/unreadnotifications';
    callApi(url, 'GET')
    .then((json) => {
      const { error, count } = json.data;
      if (!error) {
        dispatch(unreadNotificationsNumber(parseInt(count, 10)));
      }
    });
  };
}

// function logoutError(message) {
//   return {
//     type: LOGOUT_FAILURE,
//     isFetching: false,
//     isAuthenticated: true,
//     message
//   }
// }


// login action function, calls the API to get a token
const loginUser = (creds) => {
  return (dispatch) => {
    dispatch(requestLogin(creds));

    return axios.post('/api/signin', creds)
    .then(({data}) => {
      if (data.success === false) {
        dispatch(loginError(data.message));
      } else {
        // if login successful, set token in local storage
        localStorage.setItem('x-access-token', data.token);
        localStorage.setItem('login', creds.login);
        dispatch(receiveLogin(data.token));
      }
    })
    .catch(err => console.log("Error: ", err));
  }
}

// logout action function, remove local storage
const logoutUser = () => {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('x-access-token');
    dispatch(receiveLogout());
  }
}

export {
  logoutUser,
  loginUser,
  initNotificationsNumber,
  unreadNotificationsNumber,
  receiveNotification,
}


// ------------------ OLD --------------------------- //

//
// export const INVALIDATE_PROFILE = 'INVALIDATE_PROFILE'
//
// export function invalidateProfile(login) {
//   return {
//     type: INVALIDATE_PROFILE,
//     login
//   }
// }
//
// export const REQUEST_PROFILE = 'REQUEST_PROFILE'
//
// export function requestProfile(login) {
//   return {
//     type: REQUEST_PROFILE,
//     login
//   }
// }
//
// export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'
//
// export function receiveProfile(json) {
//   return {
//     type: RECEIVE_PROFILE,
//     login: json.data.data.login,
//     profile: json.data.data,
//     receivedAt: Date.now()
//   }
// }
//
// import { CALL_API } from '../middleware/api'
//
// function fetchProfile(login) {
// 	return ({
// 		login,
// 		[CALL_API]: {
// 			method: 'GET',
//    		endpoint: '/api/profile/' + login,
// 			authenticated: true,
//       	types: [REQUEST_PROFILE, RECEIVE_PROFILE, INVALIDATE_PROFILE]
// 		}
// 	})
// }
//
//
//
//
//
// export const SELECT_PROFILE = 'SELECT_PROFILE'
//
// export function selectProfile(login) {
//   return {
//     type: SELECT_PROFILE,
//     login
//   }
// }
//
//
// function shouldFetchProfile(state, login) {
// 	const profile = state.userProfiles[login];
// 	if (!profile) return true;
// 	return false;
// }
//
// // Fetches a single user from Github API unless it is cached.
// export const fetchProfileIfNeeded = (login) => (dispatch, getState) => {
// 	if (!shouldFetchProfile(getState(), login))
// 		return Promise.resolve()
// 	return dispatch(fetchProfile(login))
// }
