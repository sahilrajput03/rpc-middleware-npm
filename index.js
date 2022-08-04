const log = console.log

const createRpcPostRoute = (route, funcs, app) => {
	// Get text after : in the route
	// const fnNameKey = route.split(':')[1]

	// Use a fixed parameter name for the route
	const fnNameKey = 'functionName'

	const functionMiddleware = (req, res) => {
		const fnName = req.params[fnNameKey]
		// log({fnNameKey})
		// log({fnName})
		// log(req.body) // req.body will always be an array coz we are using `...payload` to receive all arguments when the function is called in frontend.

		try {
			// Send 403 error if client called an invalid function
			if (!Object.keys(funcs).includes(fnName)) {
				const availableFunctions = Object.keys(funcs).join(', ')
				// The HTTP 404 Not Found response status code indicates that the server cannot find the requested resource.
				return res.status(404).send({name: 'invalid function name', message: `${fnName} function does not exist in rpc's collection of function, please check the function name. \nAVAILABLE FUNCTIONS: ${availableFunctions}.`})
			}

			const responseBody = funcs[fnName](...req.body)
			res.json(responseBody)
			return
		} catch (e) {
			log(`ERROR OCCURED WHEN FUNCTION: ${fnName}(..) CALLED WITH ARGUMENTS:`, req.body)
			log(e)
			const err = {name: e.name, message: e.message}
			// The HyperText Transfer Protocol (HTTP) 400 Bad Request response status code indicates that the server cannot or will not process the request due to something that is perceived to be a client error (for example, malformed request syntax, invalid request message framing, or deceptive request routing).
			res.status(400).json(err)
			return
		}
	}

	// Make sure that end `route` looks like: `/rpcv1/:fnParam`. And *not* like `/rpcv1:fnParam` coz that causes route mismatch.
	if (!route.endsWith('/')) {
		route = route + '/'
	}
	let routePath = `${route}:${fnNameKey}`

	app.post(routePath, functionMiddleware)
}

module.exports = createRpcPostRoute
