import callApi from '../callApi.js';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const INIT_NOTIFICATIONS_NUMBER = 'INIT_NOTIFICATIONS_NUMBER';

const receiveNotification = (message, level) => ({
  type: ADD_NOTIFICATION,
  message,
  level,
});

const unreadNotificationsNumber = number => ({
  type: INIT_NOTIFICATIONS_NUMBER,
  number,
});

const initNotificationsNumber = () => (dispatch) => {
  const url = '/unreadnotifications';
  callApi(url, 'GET')
  .then(({ data: { error, count } }) => {
    if (!error) {
      dispatch(unreadNotificationsNumber(parseInt(count, 10)));
    }
  });
};

export {
  initNotificationsNumber,
  unreadNotificationsNumber,
  receiveNotification,
};
