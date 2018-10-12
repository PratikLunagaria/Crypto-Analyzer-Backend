const currentkey = require('../../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = "fcb4adf6-9ee8-40e9-bd82-3bdf46a17549";
const sqlite = require('sqlite3');
const fs = require('fs');
const {tz} = require('moment-timezone');
const QueryData = require('../../exp/QuerySample');

//TODO: Change this file for one run, generate demo data, remove unnecessary stuff
//################# DATA FUNCTIONS #########################
const apiRequest_axios = async (urlpatch) => {
    try {
        return await axios.get(`https://pro-api.coinmarketcap.com/v1/${urlpatch}`);
    } catch (error) {
        console.error(error);
    }
};

const awaitingResults = async(path) => {
    const response = await apiRequest_axios(path);
    const finalRes = await response.data.data;
    return finalRes;
};


//################################# INITIAL CRON ################################
// let Prevmonth_folder = tz('Atlantic/Reykjavik').add(-1,'days').format('MM-YYYY');
// let PrevdbName = tz('Atlantic/Reykjavik').add(-1,'days').format("DD_MM_YYYY").toString();
// let Prevdb = new sqlite.Database(`../monthlydb/${Prevmonth_folder}/${PrevdbName}.sqlite`);
// if (!fs.existsSync(`../monthlydb/${Prevmonth_folder}`)){
//     fs.mkdirSync(`../monthlydb/${Prevmonth_folder}`);
// }
// let dbName = tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString();
// let month_folder = tz('Atlantic/Reykjavik').format('MM-YYYY');
// if (!fs.existsSync(`../monthlydb/${month_folder}`)){
//     fs.mkdirSync(`../monthlydb/${month_folder}`);
// }
let db = new sqlite.Database(`../monthlydb/10-2018/02_10_2018.sqlite`);


//
// for (i = 0; i < 24; i++) {
// //     let Prevtablename = "`" + PrevdbName + '__' + i + "`";
// //     Prevdb.run(`CREATE TABLE ${Prevtablename}(id INTEGER NOT NULL,name TEXT,symbol TEXT,slug TEXT,circulating_supply REAL,total_supply REAL,max_supply REAL,date_added	TEXT,num_market_pairs	INTEGER,cmc_rank	INTEGER,last_updated	TEXT,usd_price	REAL,usd_volume_24h	REAL,usd_percent_change_1h	REAL,usd_percent_change_24h	REAL,usd_percent_change_7d	REAL,usd_market_cap	REAL,usd_last_updated	TEXT,vol_change_24h REAL)`);
//     let tablename = "`" + dbName + '__' + i + "`";
//     db.run(`CREATE TABLE ${tablename}(id INTEGER NOT NULL,name TEXT,symbol TEXT,slug TEXT,circulating_supply REAL,total_supply REAL,max_supply REAL,date_added	TEXT,num_market_pairs	INTEGER,cmc_rank	INTEGER,last_updated	TEXT,usd_price	REAL,usd_volume_24h	REAL,usd_percent_change_1h	REAL,usd_percent_change_24h	REAL,usd_percent_change_7d	REAL,usd_market_cap	REAL,usd_last_updated	TEXT,vol_change_24h REAL)`);
// };
// //
// // sleep(3000);


for (i = 22; i < 24; i++) {
    // let Prevtablename = "`" + PrevdbName + '__' + i + "`";
    // QueryData.data.map(async (datafeed) => {
    //     await Prevdb.run(`INSERT INTO ${Prevtablename}VALUES(${datafeed.id},"${datafeed.name}","${datafeed.symbol}","${datafeed.slug}",${datafeed.circulating_supply},${datafeed.total_supply},${datafeed.max_supply},"${datafeed.date_added}",${datafeed.num_market_pairs},${datafeed.cmc_rank},"${datafeed.last_updated}",${datafeed.quote.USD.price},${datafeed.quote.USD.volume_24h},${datafeed.quote.USD.percent_change_1h},${datafeed.quote.USD.percent_change_24h},${datafeed.quote.USD.percent_change_7d},${datafeed.quote.USD.market_cap},"${datafeed.quote.USD.last_updated}",0)`)
    // });
    // console.log(`data for ${Prevtablename} written successfully`)

    // sleep(5000)
    let tablename = "`" + '02_10_2018' + '__' + i+ "`";
    QueryData.data.map(async (datafeed) => {
        await db.run(`INSERT INTO ${tablename}VALUES(${datafeed.id},"${datafeed.name}","${datafeed.symbol}","${datafeed.slug}",${datafeed.circulating_supply},${datafeed.total_supply},${datafeed.max_supply},"${datafeed.date_added}",${datafeed.num_market_pairs},${datafeed.cmc_rank},"${datafeed.last_updated}",${datafeed.quote.USD.price},${datafeed.quote.USD.volume_24h},${datafeed.quote.USD.percent_change_1h},${datafeed.quote.USD.percent_change_24h},${datafeed.quote.USD.percent_change_7d},${datafeed.quote.USD.market_cap},"${datafeed.quote.USD.last_updated}",0)`)
    });
    console.log(`data for ${tablename} written successfully`);
}





