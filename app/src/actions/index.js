import axios from 'axios'

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin(id_token) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: id_token
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return axios.post('/api/signin', creds)
      .then(json =>  json.data).then(json => {
			if (json.success === false) {
         // If there was a problem, we want to
         // dispatch the error condition
         	dispatch(loginError(json.message))
				return Promise.reject(creds.login)
			} else {
			// If login was successful, set the token in local storage
				localStorage.setItem('x-access-token', json.token)
			// Dispatch the success action
			dispatch(receiveLogin(json.token))
			}
		}).catch(err => console.log("Error: ", err))
	}
}

function requestLogout(creds) {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
	return {
		type: LOGOUT_SUCCESS,
		isFetching: false,
		isAuthenticated: false
	}
}

function logoutError(message) {
  return {
    type: LOGOUT_FAILURE,
    isFetching: false,
    isAuthenticated: true,
    message
  }
}

export function logoutUser() {
	return dispatch => {
		dispatch(requestLogout())
		localStorage.removeItem('id_token')
		dispatch(receiveLogout())
	}
}


export const INVALIDATE_PROFILE = 'INVALIDATE_PROFILE'

export function invalidateProfile(login) {
  return {
    type: INVALIDATE_PROFILE,
    login
  }
}

export const REQUEST_PROFILE = 'REQUEST_PROFILE'

export function requestProfile(login) {
  return {
    type: REQUEST_PROFILE,
    login
  }
}

export const RECEIVE_PROFILE = 'RECEIVE_PROFILE'

export function receiveProfile(json) {
  return {
    type: RECEIVE_PROFILE,
    login: json.data.data.login,
    profile: json.data.data,
    receivedAt: Date.now()
  }
}

import { CALL_API } from '../middleware/api'

function fetchProfile(login) {
	return ({
		login,
		[CALL_API]: {
			method: 'GET',
   		endpoint: '/api/profile/' + login,
			authenticated: true,
      	types: [REQUEST_PROFILE, RECEIVE_PROFILE, INVALIDATE_PROFILE]
		}
	})
}


// ------------------ OLD --------------------------- //


export const SELECT_PROFILE = 'SELECT_PROFILE'

export function selectProfile(login) {
  return {
    type: SELECT_PROFILE,
    login
  }
}


function shouldFetchProfile(state, login) {
	const profile = state.userProfiles[login];
	if (!profile) return true;
	return false;
}

// Fetches a single user from Github API unless it is cached.
export const fetchProfileIfNeeded = (login) => (dispatch, getState) => {
	if (!shouldFetchProfile(getState(), login))
		return Promise.resolve()
	return dispatch(fetchProfile(login))
}
