const currentkey = require('../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = currentkey;
const sqlite = require('sqlite3');
const ontime = require('ontime');
const {tz} = require('moment-timezone');


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
    let tablename = tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString();
    let dbName = tz('Atlantic/Reykjavik').format('MM-YYYY').toString();
    let db = new sqlite.Database(`./database/monthlydb/${dbName}.sqlite`);
    db.run(`CREATE TABLE ${tablename}(id	INTEGER NOT NULL,name	TEXT,symbol	TEXT,slug	TEXT,circulating_supply	REAL,total_supply	REAL,max_supply	REAL,date_added	TEXT,num_market_pairs	INTEGER,cmc_rank	INTEGER,last_updated	TEXT,usd_price	REAL,usd_volume_24h	REAL,usd_percent_change_1h	REAL,usd_percent_change_24h	REAL,usd_percent_change_7d	REAL,usd_market_cap	REAL,usd_last_updated	TEXT, rank_mcap INTEGER, rank_change INTEGER, rank_ratio REAL)`);
};

//############################################ DAILY CRON ###################################################
//daily commands
ontime({cycle: '00:01:00', utc:true},
        async function () {
            await dbCreation();
            awaitingResults('cryptocurrency/listings/latest?limit=1988')
                .then(async(datafeed) => {
                    let inputData = datafeed.slice();
                    let changeSort = inputData.slice().sort(function(a, b){return b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d});
                    let mcapSort = inputData.slice().sort(function(a, b){return b.quote.USD.market_cap - a.quote.USD.market_cap});
                    await inputData.map(Parentdata=>{
                        Parentdata['idx_mcap'] = mcapSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
                        Parentdata['idx_chg'] = changeSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
                        Parentdata['idx_ratio'] = Parentdata['idx_mcap']/Parentdata['idx_chg'];
                    });
                    let curtablename = tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString();
                    let curdbName = tz('Atlantic/Reykjavik').format('MM-YYYY').toString();
                    let curdb = new sqlite.Database(`./database/monthlydb/${curdbName}.sqlite`);
                    curdb.run(
                        `INSERT INTO ${curtablename} VALUES(${datafeed.id},"${datafeed.name}","${datafeed.symbol}","${datafeed.slug}",${datafeed.circulating_supply},${datafeed.total_supply},${datafeed.max_supply},"${datafeed.date_added}",${datafeed.num_market_pairs},${datafeed.cmc_rank},"${datafeed.last_updated}",${datafeed.quote.USD.price},${datafeed.quote.USD.volume_24h},${datafeed.quote.USD.percent_change_1h},${datafeed.quote.USD.percent_change_24h},${datafeed.quote.USD.percent_change_7d},${datafeed.quote.USD.market_cap},"${datafeed.quote.USD.last_updated}",${datafeed.idx_mcap},${datafeed.idx_chg}, ${datafeed.idx_ratio})`)
                    }
                )
        }
    );