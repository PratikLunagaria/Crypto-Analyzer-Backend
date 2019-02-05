var db = require('knex')({
    client: 'pg',
    connection: {
        user: 'webadmin',
        host: '185.141.195.31',
        database: 'coinsdb',
        password: 'FIIlqf87643',
        port: 5432
    },
    pool: { min: 0, max: 9 }
  });

module.exports = db