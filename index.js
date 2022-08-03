const log = console.log

// Get string of length 5
const getRandomText = () => Math.random().toString(36).slice(2, 7)

const createRpcPostRoute = (route, funcs, app) => {
	// Get text after : in the route
	// const fnNameKey = route.split(':')[1]
	const fnNameKey = getRandomText()

	const functionMiddleware = (req, res) => {
		const fnName = req.params[fnNameKey]
		log({fnNameKey})
		// log({fnName})
		log(req.body) // req.body will always be an array coz we are using `...payload` to receive all arguments when the function is called in frontend.

		try {
			// Send 403 error if client called an invalid function
			if (!Object.keys(funcs).includes(fnName)) {
				const availableFunctions = Object.keys(funcs).join(', ')
				return res.status(403).send({error: `${fnName} function does not exist in rpc's collection of function, please check the function name. Please use one of these functions: ${availableFunctions}.`})
			}

			const responseBody = funcs[fnName](...req.body)
			res.json(responseBody)
			return
		} catch (error) {
			res.send(error)
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
