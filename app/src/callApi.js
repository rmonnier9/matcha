import axios from 'axios';

const callApi = (endpoint, method, data = {}, headers = {}) => {
  const token = localStorage.getItem('x-access-token') || null;
  const fullUrl = `/api${endpoint}`;
  const config = Object.assign({}, { url: fullUrl }, { method }, { data, headers });

  if (!token) { return Promise.reject(new Error('No token saved!')); }

  config.headers = { 'x-access-token': `${token}` };
  return axios(config).then((json) => {
    console.log('CallAPI :', json);
    return json;
  });
};

export default callApi;
