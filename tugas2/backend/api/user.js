import { pool, poolRemote } from './init'


const executePool = (response) => {
    const decorator = async (conn, query, data, noResponse, validResponse, emptyResponse, errorResponse) => {
        let finalResults = undefined
        
        await conn.query(query, data, (err, results) => {
            if (err) {
                if (errorResponse) {
                    response.status(400).json({'result': errorResponse})
                    return
                } else {
                    throw err
                }
            }

            // console.log(results)
            
            if (noResponse) {
                // console.log('Err noResponse')
                finalResults = results.rows
                return
            }

            // console.log('apapun')

            if (results.rows.length == 0 && results.command !== 'INSERT') {
                response.status(400).json({'result': emptyResponse})
            } else {
                response.status(200).json({'result': validResponse || results.rows})
            }
        })

        return finalResults
    }

    return decorator
}

export const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const query = 'SELECT * FROM public.users WHERE username = $1 AND password = $2'
    const params = [username, password]

    const rows = executePool(res)(pool, query, params, true, 'Success', 'Invalid username and/or password')
    console.log(rows)

    if (rows.length == 0) {
        res.status(400).json({'result': 'Invalid username and/or password'})
    } else {
        const text = `${username} logged in`

        executePool(res)(pool, `INSERT INTO public.logs (text) VALUES ('${text}')`, [], true)
        executePool(res)(poolRemote, `INSERT INTO public.logs (text) VALUES ('${text}')`, [], true)

        res.status(200).json({'result': 'Success'})
    }
}

export const register = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const query = 'INSERT INTO public.users (username, password) VALUES ($1, $2)'
    const params = [username, password]
    executePool(res)(poolRemote, query, params, false, null, 'Success', 'Username already exists')
}

export const logout = (req, res) => {
    const username = req.body.username

    const text = `${username} signed out`

    executePool(res)(pool, `INSERT INTO public.logs (text) VALUES ('${text}')`, [], true)
    executePool(res)(poolRemote, `INSERT INTO public.logs (text) VALUES ('${text}')`, [], true)
    
    res.status(200).json({'result': 'Success'})
}

export const getUsers = (req, res) => {
    const query = 'SELECT * FROM public.users'
    executePool(res)(pool, query, [])
}

export const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
    const query = 'SELECT * FROM public.users WHERE id = $1'
    const params = [id]
    executePool(res)(pool, query, params)
}
