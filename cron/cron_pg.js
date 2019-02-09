const currentkey = require('../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = currentkey;
const ontime = require('ontime');
const {tz} = require('moment-timezone');
const path = require('path');
const coinlist = require('../config/coinlist');
const dailydb = require('../config/dailydb');
const coinsdb = require('../config/coinsdb');
const moment = require('moment');
const Promise = require('bluebird');


//Obtains current date for tablename in dailydb
var currentdate = moment().format("YYYY-MM-DD");
var currentts = Math.round((new Date(currentdate)).getTime() / 1000);

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//################# Database FUNCTIONS #########################

const dailyapidata = require('../dump/response1-2.json').data;


//stores new coins fetched from cmc
var newcoins = [];

//creates new tables for new coins
var tableCreation = dailyapidata.map(async function(coindata, index){
    if(coinlist.includes(coindata['name'])){
        await newcoins.push(coindata['name']);
        await coinsdb.schema.createTable(coindata['name'], function (table) {
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
    };
});   


//sorts the data and adds the 3 types of ranks in each data object
async function dataSort(apidata){
    let inputData = await apidata.slice();
    let changeSort = await inputData.slice().sort(function(a, b){return b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d});
    let mcapSort = await inputData.slice().sort(function(a, b){return b.quote.USD.market_cap - a.quote.USD.market_cap});

    await inputData.map(async(Parentdata)=>{
        Parentdata['idx_mcap'] = await mcapSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_chg'] = await changeSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_ratio'] = Parentdata['idx_mcap']/Parentdata['idx_chg'];
    });

    return inputData;
}



async function batchInsertion(){
    var batchInputData = [];
    var tsname = 1548979200;
    var tablename = tsname.toString();
    var chunkSize = 2000;
    var fulldata = await dataSort(dailyapidata)
    var tablecreation = await dailydb.schema.hasTable(tablename)
            .then(function(exists) {
                if (!exists) {
                return dailydb.schema.createTable(tablename, function(table) {
                    table.increments('id');
                    table.string('coin');
                    table.decimal('price', null);
                    table.decimal('market_cap', null);
                    table.decimal('percent_change_24h', null);
                    table.decimal('percent_change_7d', null);
                    table.decimal('volume_24h', null);
                    table.decimal('rank_mcap',null);
                    table.decimal('rank_volume',null);
                    table.decimal('rank_ratio', null);
                }).then((one)=>{
                    console.log(one)
                }).catch((err)=>{
                    console.log(err)
                });
            }
        });
         
    var pushingdata = await fulldata.slice().map((eachdata, index)=>{
            // const currentdata = require('../full/'+tsname+'.json');
            batchInputData.push({
                coin: eachdata.slug,
                price: (typeof(eachdata.quote.USD.price) != "undefined" && eachdata.quote.USD.price != null) ? 
                parseFloat(eachdata.quote.USD.price.toFixed(4)) : 0,
                market_cap: (typeof(eachdata.quote.USD.market_cap) != "undefined" && eachdata.quote.USD.market_cap != null) ?
                parseFloat(eachdata.quote.USD.market_cap.toFixed(4)) : 0,
                percent_change_24h: (typeof(eachdata.quote.USD.percent_change_24h) != "undefined" && eachdata.quote.USD.percent_change_24h != null) ? parseFloat(eachdata.quote.USD.percent_change_24h.toFixed(4)) : 0,
                percent_change_7d: (typeof(eachdata.quote.USD.percent_change_7d) != "undefined" && eachdata.quote.USD.percent_change_7d != null) ? parseFloat(eachdata.quote.USD.percent_change_7d.toFixed(4)) : 0,
                volume_24h: (typeof(eachdata.quote.USD.volume_24h) != "undefined" && eachdata.quote.USD.volume_24h != null) ? parseFloat(eachdata.quote.USD.volume_24h.toFixed(4)) : 0,
                rank_mcap: (typeof(eachdata.idx_mcap) != "undefined" && eachdata.idx_mcap != null) ? 
                parseFloat(eachdata.idx_mcap.toFixed(4)) : 0,
                rank_volume: (typeof(eachdata.idx_chg) != "undefined" && eachdata.idx_chg != null) ? parseFloat(eachdata.idx_chg.toFixed(4)) : 0,
                rank_ratio: (typeof(eachdata.idx_ratio) != "undefined" && eachdata.idx_ratio != null) ? parseFloat(eachdata.idx_ratio.toFixed(4)) : 0
            });
        });

    //inserts into coinsdb
    var coinsert = await batchInputData.map(async(coin_data, index)=>{
        coin_data['ts'] = await tsname;
        var cointable = coin_data.coin;
        await delete coin_data.coin;
        var coininsert = await coinsdb.transaction((trx) => {
                            coinsdb(cointable)
                                .insert(coin_data)
                                .returning(['id','ts'])
                                .transacting(trx)
                                .catch((err)=>console.log(err));
        });
        var sleepinterval = await sleep(500);
        console.log(cointable);
    });

    //inserts into dailydb
    // console.log(batchInputData.length);
    // dailydb.batchInsert(tablename, batchInputData, chunkSize)
    //     .returning('id')
    //     .then(function(ids) { console.log(ids) })
    //     .catch(function(error) { console.log(error) });
    
};

batchInsertion();