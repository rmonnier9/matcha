import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080',
// });
//
// api.interceptors.request.use((config) => {
//   return {
//     ...config
//   }
// })

const callApi = (endpoint, method, data = {}, headers = {}, cancelToken = '') => {
  const token = localStorage.getItem('x-access-token') || null;
  const fullUrl = `/api${endpoint}`;
  const config = Object.assign({}, { url: fullUrl }, { method },
                                { data, headers }, { cancelToken });

  if (!token) { return Promise.reject(new Error('No token saved!')); }

  config.headers = { 'x-access-token': `${token}` };
  return axios(config).then((json) => {
    console.log('CallAPI :', json);
    return json;
  });
};

export default callApi;
