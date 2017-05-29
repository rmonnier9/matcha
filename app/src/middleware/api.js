import axios from 'axios'

const callApi = (endpoint, method) => {

	let token = localStorage.getItem('x-access-token') || null
	const config = Object.assign({}, {url: endpoint}, {method})

	if (token) {
		config.headers = { 'x-access-token': `${token}` }
	}
	else {
		throw new Error('No token saved!')
	}
	return axios(config)
	.then(json => {
		if (!json.data.success) {
			return Promise.reject(json)
		}
		return json.data
	})
}

export const CALL_API = Symbol('Call API')


// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {

	const callAPI = action[CALL_API]

	// So the middleware doesn't get applied to every single action
	if (typeof callAPI === 'undefined') {
		return next(action)
	}

	let { endpoint } = callAPI
   const { method, types } = callAPI

	if (typeof endpoint !== 'string') {
		throw new Error('Specify a string endpoint URL.')
   }
	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('Expected an array of three action types.')
	}
	if (!types.every(type => typeof type === 'string')) {
		throw new Error('Expected action types to be strings.')
	}

	const actionWith = data => {
     const finalAction = Object.assign({}, action, data)
     delete finalAction[CALL_API]
     return finalAction
   }

	const [ requestType, successType, errorType ] = types
	next(actionWith({ type: requestType }))

	// Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
	return callApi(endpoint, method).then(
		res => next(actionWith({
			type: successType,
			data: res.data,
			receivedAt: Date.now()
		})),
		error => next({
			type: errorType,
			error: error.message || 'There was an error.'
		})
	)
}
