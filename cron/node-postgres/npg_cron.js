const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'database-user',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})


pool.query('SELECT $1::text as name', ['brianc'])
  .then((res) => console.log(res.rows[0].name)) // brianc
  .catch(err => console.error('Error executing query', err.stack))