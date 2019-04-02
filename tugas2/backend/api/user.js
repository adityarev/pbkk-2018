import { clientConn, serverConn } from './init'


const errorResponse = (response, message) => {
    response.status(400).json({'result': message})
}

const successResponse = (response, message) => {
    if (message === null)
	message = 'Success'
    response.status(200).json({'result': message})
}

const assertNotEmpty = results => {
    if (results.rows.length == 0)
	throw "empty results"
    else
	return results
}

export const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const query = 'SELECT * FROM public.users WHERE username = $1 AND password = $2'
    const params = [username, password]
    
    clientConn.query(query, params)
	.catch(console.log)
	.then(assertNotEmpty)
	.then(_ => {
        	const logQuery = `INSERT INTO public.logs (text) VALUES ('${username} logged in')`
            let logs = await clientConn.query('SELECT * FROM public.logs where sync != true')
            console.log('first log', logs)
    
            logs = logs.rows.map(e => {
                return `('${e.text}', true)`
            })
            console.log(logs)
        
            const test = logs.join(', ')
            console.log(test)
            serverConn.query(`INSERT INTO public.logs (text, sync) VALUES ` + test)
            .then(res => {
                clientConn.query('UPDATE public.logs set sync = true where sync != true')
            })
		successResponse(res)
	})
	.catch(_ => errorResponse(res, 'Invalid username and/or password'))
}

export const register = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const query = 'INSERT INTO public.users (username, password) VALUES ($1, $2)'
    const params = [username, password]
    serverConn.query(query, params)
	      .then(assertNotEmpty)
	      .then(_ => errorResponse(res, 'Username already exists'))
	      .catch(_ => successResponse(res))
}

export const logout = (req, res) => {
    const username = req.body.username
    const logQuery = `INSERT INTO public.logs (text) VALUES ('${username} signed out')`
    
    
    clientConn.query(logQuery, [])
    .then(async (r) => {
        let logs = await clientConn.query('SELECT * FROM public.logs where sync != true')
        console.log('first log', logs)

        logs = logs.rows.map(e => {
            return `('${e.text}', true)`
        })
        console.log(logs)
    
        const test = logs.join(', ')
        console.log(test)
        serverConn.query(`INSERT INTO public.logs (text, sync) VALUES ` + test)
        .then(res => {
            clientConn.query('UPDATE public.logs set sync = true where sync != true')
        })
    
        successResponse(res)
    })
}

export const getUsers = (req, res) => {
    const query = 'SELECT * FROM public.users'
    clientConn.query(query, [])
	.then(users => successResponse(res, users.rows))
	.catch(console.log)
}

export const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    const query = 'SELECT * FROM public.users WHERE id = $1'
    const params = [id]
    clientConn.query(query, params)
	.then(user => successResponse(res, user.rows))
	.catch(console.log)
}
