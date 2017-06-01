import { combineReducers } from 'redux';
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
} from '../actions';

function auth(state = {
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('x-access-token'),
  currentLogin: localStorage.getItem('login'),
}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: '',
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        message: action.message,
      });
    case LOGOUT_REQUEST:
      return Object.assign({}, state, action);
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
      });
    case LOGOUT_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        message: action.message,
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;

// ------------------ OLD --------------------------- //
//
//
// import {
//   SELECT_PROFILE, REQUEST_PROFILE, RECEIVE_PROFILE, INVALIDATE_PROFILE
// } from '../actions'
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
//  case INVALIDATE_PROFILE:
//  case RECEIVE_PROFILE:
//  case REQUEST_PROFILE:
//    return Object.assign({}, state, {
//         [action.login]: profile(state[action.login], action)
//       })
//     default:
//       return state
//   }
// }
