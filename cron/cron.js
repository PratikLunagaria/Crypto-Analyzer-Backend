const { Pool } = require('pg');
const coinlist = require('../config/coinlist');
const datanames = require('../config/datanames');
const db = require('../config/localcoinsdb');


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

// function dataentry(i){
//     coinlist.slice(i,i+5).map(
//         function(coinname, index){
//             setTimeout(
//             ()=>{db.schema.createTable(coinname, function(table){
//                 table.increments('id');
//                 table.decimal('price',null);
//                 table.decimal('market_cap',null);
//                 table.decimal('percent_change_24h',null);
//                 table.decimal('percent_change_7d',null);
//                 table.decimal('volume_24h',null);
//                 table.integer('ts');
//                 table.integer('rank_mcap');
//                 table.integer('rank_volume');
//                 table.decimal('rank_ratio', null)
//             })
//             .then((val)=>console.log(index,coinname))
//             .catch((err)=>console.log(index, "error with ",coinname))}
//             ,5000);
//         }
//     );
// }

// for(j=0; j<2001; j++){
//     dataentry(j);
// }

function indentry(cname,index){
    setTimeout(
    db.schema.createTable(cname,
    function(table){
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
    })
    .then((val)=>console.log(index, val))
    .catch((err)=>console.log(err))
    ,5000)
}

coinlist.slice().map((coinname,idx)=>{
    indentry(coinname.toString(),idx)
});




// const pool = new Pool({
//     user: 'acskserver',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'onetwothree',
//     port: 5432
// });
// pool.connect().then(()=> console.log("connected"));