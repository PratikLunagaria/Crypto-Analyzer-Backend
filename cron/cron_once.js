const sqlite = require('sqlite3');
const datafeed1 = require('../static/QuerySample').data;
let db = new sqlite.Database('../db/coinsdb/coinRank.sqlite');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createTables (){
datafeed1.map(async(coinData)=>{
    let tablename =  "`"+coinData.slug.toString()+"`";
    await db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(dateis TEXT,rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
});
}

function addData (){
    Object.keys(coinData).map(async(key,value)=>{
    let tablename = "`"+coinData[key].slug.toString()+"`";
    for(i=30; i<100; i++)
    {
        d1 = 1000+i;
        d2= 1000.3281+i
        db.run(`insert into ${tablename} values(date('now'),${d1},${d1},${d2})`);
    }
});
};

createTables();