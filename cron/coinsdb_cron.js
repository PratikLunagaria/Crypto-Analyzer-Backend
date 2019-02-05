// const coinlist = require('../config/coinlist');
const coinlist = ['adamant-messenger','aencoin','aergo','almeela','baer-chain','beacon','beam','bitball', 'bitcoiin','bitcoin2network','bitguild-plat','bitmax-token','btc-lite','bulleon','byteball','centauri','centercoin','centrality','coinus','content-value-network','cova','crowdvilla-ownership','crowdvilla-point','crypto-com-chain','dash-green','dogecash','e-chat','fiii','footballcoin','fountain','gamblica','globatalent','hedgetrade','herbalist-token','hercules','hyperion','impleum','inmax','italo','kambria','kuai-token','lambda','lisk-machine-learning','livepeer','m2o','magnet','mocrow','mox','next-exchange','observer','opacity','playgame','plus-coin','proxynode','quinads','republic-protocol','rif-token','roiyal-coin','shivers','six-domain-chain','skychain','snapcoin','spectrumcash','stronghands-masternode','stronghold-token','stronghold-usd','tena','trade-token-x','travelnote','ultiledger','usdcoin','view','winco'];

const db = require('../config/coinsdb');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

coinlist.map(async function(coinname, index){
    const currentdata = await require('../coinsdb/'+coinname+'.json');
    await db.batchInsert(coinname, currentdata, 1000)
        .returning('id')
        .then(function(ids) { console.log(ids) })
        .catch(function(error) { console.log(error) });
    sleep(1000);
});

