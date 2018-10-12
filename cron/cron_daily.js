const currentkey = require('../../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = currentkey;
const sqlite = require('sqlite3');
const ontime = require('ontime');
const fs = require('fs');
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

//##################//
//TODO: Change the calculations
const PrevData = async(coredata,Prevdb,Prevtablename,dbnow,tablenow) =>{
      let sql=`SELECT usd_volume_24h FROM ${Prevtablename} WHERE id=${coredata.id}`;
      return await Prevdb.all(sql, [], (err,rows) => {
          try {
              let prevVal = 0;
              if(typeof(rows[0]) != 'undefined'){
                    prevVal = rows[0].usd_volume_24h;
                }
                else if(typeof(rows[0])=='undefined'){
                    prevVal = 0;
                }
                else{
                    prevVal = 0;
                }
              let curVal = coredata.quote.USD.volume_24h;
              var diff = curVal - prevVal;
              var equate = (diff/prevVal)*100;
              let resultPrevData = null;
              if(isFinite(equate)){
                  resultPrevData = equate;
              }else{
                  resultPrevData = 0;
              }
              // console.log("prevVal:",prevVal,"curVal:",curVal,"difference:",diff,"equate:",equate, "result:", resultPrevData);
              InsertData(coredata,resultPrevData,dbnow,tablenow);
              return resultPrevData;

          }catch (e) {
              console.log(e);
          }
          })
};

//TODO: Insert data according to new columns
const InsertData = (datafeed, new_vol_change_24h,curDB,curTable) => {
    return curDB.run(
        `INSERT INTO ${curTable} VALUES(${datafeed.id},"${datafeed.name}","${datafeed.symbol}","${datafeed.slug}",${datafeed.circulating_supply},${datafeed.total_supply},${datafeed.max_supply},"${datafeed.date_added}",${datafeed.num_market_pairs},${datafeed.cmc_rank},"${datafeed.last_updated}",${datafeed.quote.USD.price},${datafeed.quote.USD.volume_24h},${datafeed.quote.USD.percent_change_1h},${datafeed.quote.USD.percent_change_24h},${datafeed.quote.USD.percent_change_7d},${datafeed.quote.USD.market_cap},"${datafeed.quote.USD.last_updated}",${new_vol_change_24h})`)
};

const WholeData = async(maindata,Pdb,Ptablename, Cdb, Ctablename) => {
    await PrevData(maindata,Pdb,Ptablename, Cdb, Ctablename);
};


//################################# HOURLY CRON ################################
//TODO: Change this to daily command
//hourly commands
ontime({
    cycle: [ '00:05:00', '01:00:00', '02:00:00', '03:00:00',
            '04:00:00', '05:00:00', '06:00:00', '07:00:00',
            "08:00:00", "09:00:00", "10:00:00", "11:00:00",
            "12:00:00", "13:00:00", "14:00:00", "15:00:00",
            "16:00:00", "17:00:00", "18:00:00", "19:00:00",
            "20:00:00", "21:00:00", "22:00:00", "23:00:00"],
    utc:true
}, function () {
        awaitingResults('cryptocurrency/listings/latest?limit=1988')
            .then(data => {
                let Prevmonth_folder = tz('Atlantic/Reykjavik').add(-1,'days').format('MM-YYYY');
                let PrevdbName = tz('Atlantic/Reykjavik').add(-1,'days').format("DD_MM_YYYY").toString();
                let Prevdb = new sqlite.Database(`./database/monthlydb/${Prevmonth_folder}/${PrevdbName}.sqlite`);
                let Prevtablename = "`"+PrevdbName+'__'+tz('Atlantic/Reykjavik').hour()+"`";
                let cur_dbName = tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString();
                let cur_month_folder = tz('Atlantic/Reykjavik').format('MM-YYYY');
                let cur_db = new sqlite.Database(`./database/monthlydb/${cur_month_folder}/${cur_dbName}.sqlite`);
                let cur_tablename = "`"+cur_dbName+'__'+tz('Atlantic/Reykjavik').hour()+"`";
                data.map(value=>WholeData(value,Prevdb,Prevtablename,cur_db,cur_tablename));
            }
        )
});


//############################################ DAILY CRON ###################################################
//TODO: change the fields, add columns as necessary
//daily commands
ontime({cycle: '00:01:00', utc:true},
    function () {
        let dbName = tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString();
        let month_folder = tz('Atlantic/Reykjavik').format('MM-YYYY');
        if (!fs.existsSync(`./database/monthlydb/${month_folder}`)){
          fs.mkdirSync(`./database/monthlydb/${month_folder}`);
        }

        let db = new sqlite.Database(`./database/monthlydb/${month_folder}/${dbName}.sqlite`);
        for(i=0; i<24;i++){
            let tablename = "`"+dbName+'__'+i+"`";
            db.run(`CREATE TABLE ${tablename}(id	INTEGER NOT NULL,name	TEXT,symbol	TEXT,slug	TEXT,circulating_supply	REAL,total_supply	REAL,max_supply	REAL,date_added	TEXT,num_market_pairs	INTEGER,cmc_rank	INTEGER,last_updated	TEXT,usd_price	REAL,usd_volume_24h	REAL,usd_percent_change_1h	REAL,usd_percent_change_24h	REAL,usd_percent_change_7d	REAL,usd_market_cap	REAL,usd_last_updated	TEXT,vol_change_24h REAL)`)};
});