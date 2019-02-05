const currentkey = require('../config/extkeys');
const axios = require('axios');
axios.defaults.headers.get['X-CMC_PRO_API_KEY'] = currentkey;
const ontime = require('ontime');
const {tz} = require('moment-timezone');
const path = require('path');
const coinlist = require('../config/coinlist');
const dailydb = require('../config/dailydb');
const coinsdb = require('../config/coinsdb');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//################# DATA FUNCTIONS #########################

const dailyapidata = require('../dump/response1-2.json').data;

var newcoins = [];

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

var dataSort = async(apidata) => {
    let inputData = await apidata.slice();
    let changeSort = await inputData.slice().sort(function(a, b){return b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d});
    let mcapSort = await inputData.slice().sort(function(a, b){return b.quote.USD.market_cap - a.quote.USD.market_cap});

    await inputData.map(Parentdata=>{
        Parentdata['idx_mcap'] = mcapSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_chg'] = changeSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_ratio'] = Parentdata['idx_mcap']/Parentdata['idx_chg'];
    });

    console.log(inputData);
}


dataSort(dailyapidata);