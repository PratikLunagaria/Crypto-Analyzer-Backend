var db = require('knex')({
    client: 'pg',
    connection: {
        user: 'acskserver',
        host: 'localhost',
        database: 'testone',
        password: 'onetwothree',
        port: 5432
    },
    pool: { min: 0, max: 500 },
    acquireConnectionTimeout: 120000
  });

module.exports = db;