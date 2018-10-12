const express = require('express');
const router = express.Router();
const coinsDataJson = require('../static/coinsDataJson');


//TODO: Add GET requests for last 7 days, 30 days, one year and so on, use highcharts if necessary
router.get('/:id',(req,res)=>{
    const Qcoin = req.params.id;
    Object.keys(coinsDataJson).map((key,value)=>{
        if(coinsDataJson[key].slug==Qcoin){
            res.json(coinsDataJson[key]);
        }
    });
});

module.exports = router;
