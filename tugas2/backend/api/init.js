import { Pool } from 'pg'

export const clientConn = new Pool({
  user: 'pbkk',
  host: 'localhost',
  database: 'pbkk',
  password: 'nuzulcarrykita',
  port: 5432,
})

export const serverConn = new Pool({
  user: 'pbkk',
  host: 'rsmbyk.com',
  database: 'pbkk',
  password: 'nuzulcarrykita',
  port: 15432,
})
