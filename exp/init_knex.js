const path = require('path');
const fulllist = require('./fulllist');
const moment = require('moment');
const knex = require('../config/knex_sqlite');

fulllist.map((coinName,idx)=>
    knex.schema.createTable(coinName, function (table) {
        table.string('dateis');
        table.decimal('price');
        table.decimal('volume_24h');
        table.decimal('percent_change_24h');
        table.decimal('percent_change_7d');
        table.integer('rank_mcap');
        table.integer('rank_volume');
        table.decimal('rank_ratio');
    })
);

// fulllist.map((coinName, idx)=>{
//     let tablename =  "`"+coinName.toString()+"`";
//     db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(dateis TEXT,price REAL, volume_24h REAL, percent_change_24h REAL, percent_change_7d REAL, rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
// });

// fulllist.map((coinName,idx)=>{
//     var datafeed = require(`../db/datafeed/${coinName}.json`)
//     return datafeed.map((coinData,index) => {
//         let tablename =  "`"+coinName.toString()+"`";
//         let currentDate = moment.unix(parseInt(coinData.ts)).format('YYYY-MM-DD');
//         db.run(`INSERT INTO ${tablename} (dateis,price, volume_24h, percent_change_24h, percent_change_7d, rank_mcap, rank_change, rank_ratio) VALUES(${currentDate},${coinData.price},${coinData.volume_24h},${coinData.percent_change_24h},${coinData.percent_change_7d},${coinData.rank_mcap},${coinData.rank_volume},${coinData.rank_ratio})`);
//     });
// })
