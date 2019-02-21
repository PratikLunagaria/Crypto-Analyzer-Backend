const currentkey = require('../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = currentkey;
const sqlite = require('sqlite3');
const ontime = require('ontime');
const {tz} = require('moment-timezone');
const path = require('path');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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

const dbCreation = () => {
    let tablename = "`"+tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString()+"`";
    let dbName = tz('Atlantic/Reykjavik').format('MM-YYYY').toString();
    let db = new sqlite.Database(`./db/monthlydb/${dbName}.sqlite`);
    db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(id	INTEGER NOT NULL,name	TEXT,symbol	TEXT,slug	TEXT,circulating_supply	REAL,total_supply	REAL,max_supply	REAL,date_added	TEXT,num_market_pairs	INTEGER,cmc_rank	INTEGER,last_updated	TEXT,usd_price	REAL,usd_volume_24h	REAL,usd_percent_change_1h	REAL,usd_percent_change_24h	REAL,usd_percent_change_7d	REAL,usd_market_cap	REAL,usd_last_updated	TEXT, rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);

};

//############################################ DAILY CRON ###################################################
//daily commands
let db = new sqlite.Database(path.resolve(__dirname, '..', 'db', 'coinsdb','coinRank.sqlite'));


ontime({cycle: '00:05:00', utc:true},
        async function () {
            await dbCreation();
            awaitingResults('cryptocurrency/listings/latest?limit=2000')
                .then(
                    async(datafeed) => {
                        console.log("hello");
                    let inputData = datafeed.slice();
                    let changeSort = inputData.slice().sort(function(a, b){return b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d});
                    let mcapSort = inputData.slice().sort(function(a, b){return b.quote.USD.market_cap - a.quote.USD.market_cap});

                    await inputData.map(Parentdata=>{
                        Parentdata['idx_mcap'] = mcapSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
                        Parentdata['idx_chg'] = changeSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
                        Parentdata['idx_ratio'] = Parentdata['idx_mcap']/Parentdata['idx_chg'];
                    });

                    let curtablename = "`"+tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString()+"`";
                    let curdbName = tz('Atlantic/Reykjavik').format('MM-YYYY').toString();
                    let curdb = new sqlite.Database(path.resolve(__dirname, '..', 'db','monthlydb',`${curdbName}.sqlite`));

                    await inputData.map(processed => 
                     curdb.run(
                        `INSERT INTO ${curtablename} VALUES(${processed.id},"${processed.name}","${processed.symbol}","${processed.slug}",${processed.circulating_supply},${processed.total_supply},${processed.max_supply},"${processed.date_added}",${processed.num_market_pairs},${processed.cmc_rank},"${processed.last_updated}",${processed.quote.USD.price},${processed.quote.USD.volume_24h},${processed.quote.USD.percent_change_1h},${processed.quote.USD.percent_change_24h},${processed.quote.USD.percent_change_7d},${processed.quote.USD.market_cap},"${processed.quote.USD.last_updated}",${processed.idx_mcap},${processed.idx_chg}, ${processed.idx_ratio})`)
                    );
                    
                    await  datafeed.map(async(coinData) => {
                        let tablename =  "`"+coinData.slug.toString()+"`";
                        await db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(dateis TEXT,price REAL, volume_24h REAL, percent_change_24h REAL, percent_change_7d REAL, rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
                        // await db.run(`CREATE TABLE IF NOT EXISTS ${tablename}(dateis TEXT,rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
                    });

                    await sleep(3000);
                    
                    await inputData.map((coinData) => {
                        let tablename =  "`"+coinData.slug.toString()+"`";
                        db.run(`INSERT INTO ${tablename}(dateis,price,volume_24h,percent_change_24h,percent_change_7d,rank_mcap,rank_change,rank_ratio) VALUES(date('now'),${coinData.quote.USD.price},${coinData.quote.USD.volume_24h},${coinData.quote.USD.percent_change_24h},${coinData.quote.USD.percent_change_7d},${coinData.idx_mcap},${coinData.idx_chg},${coinData.idx_ratio})`)
                        // db.run(`INSERT INTO ${tablename} VALUES(date('now'),${coinData.idx_mcap},${coinData.idx_chg},${coinData.idx_ratio})`);
                    });

                    await console.log('done');
                    console.log('okay');
                    }
                )
        }
    );
// processing(datafeed1);
