import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'offline_first',
  password: 'asdzxc',
  port: 5432,
})

export default pool
