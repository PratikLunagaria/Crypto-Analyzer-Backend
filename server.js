const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const home = require('./routes/home');
const coinHome =require('./routes/coinHome');
require(path.join(__dirname,'cron','cron_daily'));




//getting json input from frontend
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//TODO: enable this in production
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "https://condescending-kowalevski-f5bd7e.netlify.com");
  res.header('Access-Control-Allow-Methods','GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//##################################       MORGAN       ########################################
var logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/pvt/api/home', home);
app.use('/pvt/api/coins', coinHome);

const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Server running on ${port}`));