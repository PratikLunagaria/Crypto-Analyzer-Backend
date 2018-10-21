const express = require('express');
const router = express.Router();
const sqlite = require('sqlite3');
const {tz} = require('moment-timezone');


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
        let dbName = tz('Atlantic/Reykjavik').add(-5,'minutes').format('MM-YYYY').toString();
        let Qdb = new sqlite.Database(`./db/monthlydb/${dbName}.sqlite`);
        let Qtablename = "`"+tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString()+"`";
        let QPsql=`SELECT * FROM ${Qtablename}`;
        
        await Qdb.all(QPsql, [], (err,mcap_desc) => responseObj['home_table']=mcap_desc);
       
        await sleep(300);
        return responseObj;
    };
    const sendResults = async() => {
        const finalResponse = await QueryHomePump();
        res.json(finalResponse);
    };
    sendResults();
});
module.exports = router;


// let Qtablename = "`"+tz('Atlantic/Reykjavik').format("DD_MM_YYYY").toString()+"`";
//         let QPsql=`SELECT * FROM ${Qtablename} WHERE rank_mcap IS NOT NULL order by rank_mcap DESC LIMIT 100`;
//         let QDsql=`SELECT * FROM ${Qtablename} WHERE rank_mcap IS NOT NULL order by rank_mcap ASC LIMIT 100`;
//         let QChgDsql = `SELECT * FROM ${Qtablename} WHERE rank_change IS NOT NULL order by rank_change DESC LIMIT 100`;
//         let QChgAsql = `SELECT * FROM ${Qtablename} WHERE rank_change IS NOT NULL order by rank_change ASC LIMIT 100`;
//         let QRRDsql = `SELECT * FROM ${Qtablename} WHERE rank_ratio IS NOT NULL order by rank_ratio DESC LIMIT 100`;
//         let QRRAsql = `SELECT * FROM ${Qtablename} WHERE rank_ratio IS NOT NULL order by rank_ratio ASC LIMIT 100`;
//         await Qdb.all(QPsql, [], (err,mcap_desc) => responseObj['rank_mcap_DESC']=mcap_desc);
//         await Qdb.all(QDsql, [], (err,mcap_asc) => responseObj['rank_mcap_ASC']=mcap_asc);
//         await Qdb.all(QChgDsql, [], (err,chg_desc) => responseObj['rank_Chg_DESC']=chg_desc);
//         await Qdb.all(QChgAsql, [], (err,chg_asc) => responseObj['rank_Chg_ASC']=chg_asc);
//         await Qdb.all(QRRDsql, [], (err,ratio_desc) => responseObj['rank_ratio_DESC']=ratio_desc);
//         await Qdb.all(QRRAsql, [], (err,ratio_asc) => responseObj['rank_ratio_ASC']=ratio_asc);