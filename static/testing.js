const Sampledata = require('./QuerySample');

let hello = Sampledata.data.slice();


const CRON_1 = (inputData) => {
    let changeSort = inputData.slice().sort(function(a, b){return b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d});
    let mcapSort = inputData.slice().sort(function(a, b){return b.quote.USD.market_cap - a.quote.USD.market_cap});
    inputData.map(Parentdata=>{
        Parentdata['idx_mcap'] = mcapSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_chg'] = changeSort.findIndex(data => data.symbol === Parentdata.symbol)+1;
        Parentdata['idx_ratio'] = Parentdata['idx_mcap']/Parentdata['idx_chg'];
    });
};

CRON_1(hello);
console.log(hello[500]);