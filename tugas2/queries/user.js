import pool from './init'

export const getUserById = (request, response) => {
  const id = parseInt(request.params.id)
  
  pool.query('SELECT * FROM public.user WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
