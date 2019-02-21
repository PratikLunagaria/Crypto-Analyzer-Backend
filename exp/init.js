const sqlite = require('sqlite3');
const path = require('path');
const fulllist = require('./fulllist');
const moment = require('moment');


let db = new sqlite.Database(path.resolve(__dirname, '..', 'makedb','coinRank.sqlite'));


fulllist.slice().map((coinName, idx)=>{
    let tablename =  "`"+coinName.toString()+"`";
    db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(dateis TEXT,price REAL, volume_24h REAL, percent_change_24h REAL, percent_change_7d REAL, rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
});

// fulllist.slice(0,5).map((coinName,idx)=>{
//     var datafeed = require(`../db/datafeed/${coinName}.json`)
//     return datafeed.map(async(coinData,index) => {
//         let tablename =  "`"+coinName.toString()+"`";
//         let utcDate = "`"+moment.unix(parseInt(coinData.ts)).format('YYYY-MM-DD').toString()+"`";
//         let Query = `INSERT INTO ${tablename} (dateis, price, volume_24h, percent_change_24h, percent_change_7d, rank_mcap, rank_change, rank_ratio) VALUES(${utcDate}, ${coinData.price}, ${coinData.volume_24h}, ${coinData.percent_change_24h}, ${coinData.percent_change_7d}, ${coinData.rank_mcap}, ${coinData.rank_volume}, ${coinData.rank_ratio})`
//         let finalQuery = await Query.toString();
//         db.run(finalQuery);
//     });
// })