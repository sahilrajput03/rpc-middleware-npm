# rpc-middleware

**Live Demo: [https://rpc-demo.herokuapp.com](https://rpc-demo.herokuapp.com), Source Code: [Click here](https://github.com/sahilrajput03/learn-rpc-middlewares/tree/main/my-rpc)**

## Why?

**STOP hustle of naming endpoints points and request types (get/post/put/delete/etc) in your existing projects and simply start calling functions (you make in server) from frontend directly.**

Easy to incorporate into existing projects so you can focus simply calling server functions.

**Github: [https://github.com/sahilrajput03/rpc-middleware-npm](https://github.com/sahilrajput03/rpc-middleware-npm)**

## Get Started

All below code is already deployed @ **live demo: [https://rpc-demo.herokuapp.com](https://rpc-demo.herokuapp.com), Source Code: [Click here](https://github.com/sahilrajput03/learn-rpc-middlewares/tree/main/my-rpc)**

**On server:**

Create two files: `server.js` and `server-functions.js` like below.

```js
module.exports.test = () => 'works!'

// string as parameter
module.exports.yoy = (message) => {
	return message + ' from server..'
}

// object as parameter
module.exports.cat = (body) => {
	const {say} = body
	return 'Cat says:' + say + '!!'
}

// multiple parameter
module.exports.love = (name1, name2) => {
	return `God loves: ${name1} and ${name2}`
}
```

and

```js
const express = require('express')
const fns = require('./server-functions')
const createRpcPostRoute = require('rpc-middleware')

const PORT = 8080
const app = express()
app.use(express.json())

app.get('/', (_, res) => res.sendFile(__dirname + '/index.html'))

// This calls: `app.post(route, functionMiddleware)` internally
createRpcPostRoute('/rpc', fns, app)

// FYI: You can create multiple rpc routes for different version of an api
// createRpcPostRoute('/rpc/v2', ver2fns, app)

app.listen(PORT, () => {
	console.log('Server started on port:', PORT)
})
```

and thats it for the server and you may start the server by running `node server.js`

**On frontend (react/vue/angular/vanilla/etc):**

```js
// STEP1: Setup RPC client
const rpc = createRpc('/rpc')

// STEP2: Call functions now
const res = await rpc.test()
const res = await rpc.yoy('God loves all')
const res = await rpc.cat({say: 'meoww'})
const res = await rpc.love('donald', 'pikachu')

try {
	const res = await rpc.someNonExistingFunction('pokemons')
} catch (error) {
	const errStatus = 'error.response.status: ' + error.response.status
	const respData = 'error.response.data.error: ' + error.response.data.error
	console.log(errStatus + ', ' + respData)
}

// Utility function to create our rpc client
function createRpc(url) {
	const target = {}
	const handler = {
		get(target, prop) {
			return async (...functionParams) => {
				// log(`functionName?:${prop}, functionParams:${functionParams}`)
				// Send `functionParams` as body for the request
				// Make sure that end `route` looks like: `/rpcv1/:fnParam`. And *not* like `/rpcv1:fnParam` coz that causes route mismatch.
				if (!url.endsWith('/')) {
					url = url + '/'
				}
				return await axios.post(`${url}${prop}`, functionParams)
			}
		},
	}

	return new Proxy(target, handler)
}
```

Congrats if you ran all above code. Thanks for trying it out. Conside starring the **[sahilrajput03/context-maker-npm.git](https://github.com/sahilrajput03/context-maker-npm.git)** repository to appreciate my works.
