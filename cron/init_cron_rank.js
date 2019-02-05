const coinlist = require('../config/coinlist');
const datanames = require('../config/datanames');
const db = require('../config/dailydb');

datanames.slice(74,92).map((tsname, index)=>{
    const currentdata = require('../full/'+tsname+'.json');
    var chunkSize = 2000;
    db.batchInsert(tsname, currentdata, chunkSize)
        .returning('id')
        .then(function(ids) { console.log(ids) })
        .catch(function(error) { console.log(error) });
});