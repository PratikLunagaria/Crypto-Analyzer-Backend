const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3');
// const coinsDataJson = require('../static/coinsDataJson');


router.get('/:id',(req,res)=>{
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const Qcoin = req.params.id;
    let Qdb = new sqlite.Database('./db/coinsdb/coinRank.sqlite');
    let Qtablename =  "`"+ Qcoin.toString()+"`";

    const QueryCoin = async() => {
        var responseObj = {};
        let QFullsql = `SELECT * FROM ${Qtablename} `;
        await Qdb.all(QFullsql, [], (err,ratio_asc) => responseObj=ratio_asc);
        await sleep(30);
        return responseObj;
    };
    const sendResults = async() => {
        const finalResponse = await QueryCoin();
        res.json(finalResponse);
    };
    sendResults();
});

module.exports = router;



 // Object.keys(coinsDataJson).map((key,value)=>{
    //     if(coinsDataJson[key].slug==Qcoin){
    //         res.json(coinsDataJson[key]);
    //     }
    // });