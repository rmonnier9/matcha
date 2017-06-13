import { combineReducers } from 'redux';

import auth from './authReducer';
import notifications from './notifReducer';

const rootReducer = combineReducers({
  auth,
  notifications,
});

export default rootReducer;
