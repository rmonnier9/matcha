import { combineReducers } from 'redux'
import {
  SELECT_PROFILE, REQUEST_PROFILE, RECEIVE_PROFILE, INVALIDATE_PROFILE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGOUT_REQUEST
} from '../actions'

function auth(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('x-access-token') ? true : false
  }, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
		  errorMessage: ''
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
	case LOGOUT_REQUEST:
		return Object.assign({}, state, action)
	case LOGOUT_SUCCESS:
   	return Object.assign({}, state, {
      	isFetching: true,
      	isAuthenticated: false
		})
	default:
		return state
  }
}



const rootReducer = combineReducers({
	auth
})

export default rootReducer

// ------------------ OLD --------------------------- //
// 
// function selectedProfile(state = '', action) {
//   switch (action.type) {
//     case SELECT_PROFILE:
//       return action.login
//     default:
//       return state
//   }
// }
//
//
// function profile(state = {
//   isFetching: false,
//   didInvalidate: false
// }, action) {
//   switch (action.type) {
//     case INVALIDATE_PROFILE:
//       return Object.assign({}, state, {
//         didInvalidate: true
//       })
//     case REQUEST_PROFILE:
//       return Object.assign({}, state, {
//         isFetching: true,
//         didInvalidate: false
//       })
//     case RECEIVE_PROFILE:
//       return Object.assign({}, state, {
//         isFetching: false,
//         didInvalidate: false,
//         profile: action.data,
//         lastUpdated: action.receivedAt
//       })
//     default:
//       return state
//   }
// }
//
// function currentProfile(state = {}, action) {
//   switch (action.type) {
// 	  case INVALIDATE_PROFILE:
// 	  case RECEIVE_PROFILE:
// 	  case REQUEST_PROFILE:
// 	  	return Object.assign({}, state, {
//         [action.login]: profile(state[action.login], action)
//       })
//     default:
//       return state
//   }
// }
