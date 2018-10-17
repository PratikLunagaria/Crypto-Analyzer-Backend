function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const parent = async() => {
    await sleep(1000);
    console.log("1000");
    await sleep(2000);
    console.log("2000");
}

parent();