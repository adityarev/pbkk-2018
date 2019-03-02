import { Pool } from 'pg'

const pool = new Pool({
  user: 'pbkk',
  host: 'localhost',
  database: 'pbkk',
  password: 'nuzulcarrykita',
  port: 5432,
})

export default pool
