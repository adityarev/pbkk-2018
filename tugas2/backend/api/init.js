import { Pool } from 'pg'

export const pool = new Pool({
  user: 'pbkk',
  host: 'localhost',
  database: 'pbkk',
  password: 'nuzulcarrykita',
  port: 5432,
})

export const poolRemote = new Pool({
  user: 'pbkk',
  host: 'rsmbyk.com',
  database: 'pbkk',
  password: 'nuzulcarrykita',
  port: 5432,
})