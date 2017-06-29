import {
  ADD_NOTIFICATION, INIT_NOTIFICATIONS_NUMBER,
} from '../actions/notifAction';

export default function notifications(state = { notificationsNumber: 0 }, action) {
  switch (action.type) {
    case INIT_NOTIFICATIONS_NUMBER:
      return Object.assign({}, state, {
        notificationsNumber: action.number,
      });
    case ADD_NOTIFICATION: {
      console.log(action);
      return Object.assign({}, state, {
        last: { message: action.message, level: action.level },
        notificationsNumber: state.notificationsNumber + 1,
      });
    }
    default:
      // console.debug('notification reducer :: hit default', action.type);
      return state;
  }
}
