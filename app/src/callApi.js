import axios from 'axios'

const callApi = (endpoint, method, data = {}) => {

	let token = localStorage.getItem('x-access-token') || null
	const fullUrl = '/api' + endpoint
	const config = Object.assign({}, {url: fullUrl}, {method}, {data})

	if (token) {
		config.headers = { 'x-access-token': `${token}` }
	}
	else {
		throw new Error('No token saved!')
	}
	return axios(config)
	.then()
}

export default callApi
