const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3');
const moment = require('moment');
const {tz} = require('moment-timezone');


//TODO: Fetch additional rows from the database and provide sorting functionality
// @route   GET
// @desc    Home data
// @access  Public
router.get('/',(req,res)=>{
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //Query Market
    const QueryHomePump = async() => {
        var responseObj = {};
        let month_folder = tz('Atlantic/Reykjavik').add(-5,'minutes').format('MM-YYYY');
        let dbName = tz('Atlantic/Reykjavik').add(-5,'minutes').format("DD_MM_YYYY").toString();
        let Qdb = new sqlite.Database(`./database/monthlydb/${month_folder}/${dbName}.sqlite`);
        let Qtablename = "`"+dbName+'__'+tz('Atlantic/Reykjavik').add(-5, 'minutes').hour()+"`";
        console.log(Qtablename);
        let QPsql=`SELECT * FROM ${Qtablename} WHERE vol_change_24h IS NOT NULL order by vol_change_24h DESC LIMIT 100`;
        let QDsql=`SELECT * FROM ${Qtablename} WHERE vol_change_24h IS NOT NULL order by vol_change_24h ASC LIMIT 100`;
        await Qdb.all(QPsql, [], (err,pumprows) => responseObj['DESC']=pumprows);
        await Qdb.all(QDsql, [], (err,dumprows) => responseObj['ASC']=dumprows);
        await sleep(30);
        return responseObj;
    };
    const sendResults = async() => {
        const finalResponse = await QueryHomePump();
        res.json(finalResponse);
    };
    sendResults();
});
module.exports = router;