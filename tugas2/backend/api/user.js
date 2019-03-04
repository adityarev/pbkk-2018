import pool from './init'


const executePool = (response) => {
    const decorator = (query, data, noResponse, validResponse, emptyResponse, errorResponse) => {
        pool.query(query, data, (err, results) => {
            if (err) {
                if (errorResponse) {
                    response.status(400).json({'result': errorResponse})
                    return
                } else {
                    throw err
                }
            }
            
            if (noResponse) {
                return results.rows
            }

            if (results.rows.length == 0 && results.command !== 'INSERT') {
                response.status(400).json({'result': emptyResponse})
            } else {
                response.status(200).json({'result': validResponse || results.rows})
            }
        })
    }

    return decorator
}

export const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const query = 'SELECT * FROM public.users WHERE username = $1 AND password = $2'
    const params = [username, password]

    executePool(res)(query, params, false, 'Success', 'Invalid username and/or password')
}

export const register = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const query = 'INSERT INTO public.users (username, password) VALUES ($1, $2)'
    const params = [username, password]
    executePool(res)(query, params, false, null, 'Success', 'Username already exists')
}

export const getUsers = (req, res) => {
    const query = 'SELECT * FROM public.users'
    executePool(res)(query, [])
}

export const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    const query = 'SELECT * FROM public.users WHERE id = $1'
    const params = [id]
    executePool(res)(query, params)
}
