const dbcleaner = require('knex-cleaner');
const db = require('../config/coinsdb');

dbcleaner.clean(db).then(function() {
    // your database is now clean
    console.log('cleaned');
  });