import axios from 'axios'

const callApi = (endpoint, method, data = {}) => {

	const token = localStorage.getItem('x-access-token') || null
	const fullUrl = '/api' + endpoint
	const config = Object.assign({}, {url: fullUrl}, {method}, {data})

	if (!token) { return Promise.reject(new Error('No token saved!'))	}

	config.headers = { 'x-access-token': `${token}` }
	return axios(config).then(json => {console.log("CallAPI :", json); return json})
}

export default callApi
