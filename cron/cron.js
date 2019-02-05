const { Pool } = require('pg');
const coinlist = require('../config/coinlist');
const datanames = require('../config/datanames');
const db = require('../config/coinsdb');



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// datanames.map((ts, index)=>{
//     db.schema.createTable(ts, function(table){
//         table.increments('id');
//         table.string('coin');
//         table.decimal('price', null);
//         table.decimal('market_cap', null);
//         table.decimal('percent_change_24h', null);
//         table.decimal('percent_change_7d', null);
//         table.decimal('volume_24h', null);
//         table.integer('ts');
//         table.decimal('rank_mcap',null);
//         table.decimal('rank_volume',null);
//         table.decimal('rank_ratio', null);
//     }).then((one)=>{
//         console.log(one)
//     }).catch((err)=>{
//         console.log(err)
//     })
// });
coinlist.slice(1800,1997).map((coinname, index)=>{
    db.schema.createTable(coinname, function (table) {
    table.increments('id');
    table.decimal('price',null);
    table.decimal('market_cap',null);
    table.decimal('percent_change_24h',null);
    table.decimal('percent_change_7d',null);
    table.decimal('volume_24h',null);
    table.integer('ts');
    table.integer('rank_mcap');
    table.integer('rank_volume');
    table.decimal('rank_ratio', null)
}).then((value)=> {
    console.log('created db for' + value);
    sleep(2000);
}).catch((err)=> console.log(err));
});



// const pool = new Pool({
//     user: 'acskserver',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'onetwothree',
//     port: 5432
// });
// pool.connect().then(()=> console.log("connected"));

