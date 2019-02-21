var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./knex.sqlite"
    }
  });