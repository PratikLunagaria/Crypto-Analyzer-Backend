const chainf = require('chain-function');


var hello = 9;

function one(){
    hello += 1;
    console.log(1,hello);
}

function two(){
    hello += 10;
    console.log(2, hello);
}

var combined = chainf(two,one);

combined();