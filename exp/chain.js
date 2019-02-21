const chain = require('chain');

var hello = 9;

// async function addtohello(){
//     await setTimeout(() => {
//         hello += 1;
//         console.log(1,hello);
//     }, 5000);

//     await setTimeout(() => {
//         hello += 10;
//         console.log(2, hello);
//     }, 3000);
// }

// addtohello();


chain.run(
    (next)=>{setTimeout(() => {
        hello += 1;
        console.log(1,hello);
    }, 5000);
    next();
}
).thenChain(
    ()=>{setTimeout(() => {
        hello += 10;
        console.log(2, hello);
    }, 3000)}
)