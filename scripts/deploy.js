require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// const web3 = require('web3');

console.warn("Deprecated: Individual deployment scripts are no longer supported");
console.warn("Please use the script available at https://github.com/fetchoracle/monorepo, in the fetch-contracts folder, to deploy all Fetch Oracle contracts at once");
/*
//const dotenv = require('dotenv').config()
//npx hardhat run scripts/deploy.js --network rinkeby
//npx hardhat run scripts/deploy.js --network harmony_testnet
//npx hardhat run scripts/deploy.js --network harmony_mainnet

var fetchAddress = '0x20763435F23a727CD8748CE5d80a0b9F9c886110'

async function deployAutopay(_network, _pk, _nodeURL, fetchAdd) {
    console.log("deploy autopay")
    await run("compile")

    var net = _network

    ///////////////Connect to the network
    let privateKey = _pk;
    var provider = new ethers.providers.JsonRpcProvider(_nodeURL)
    let wallet = new ethers.Wallet(privateKey, provider)

    /////////// Deploy autopay
    console.log("deploy autopay")

    ///////////// Query data storage
    console.log("Starting deployment for QueryDataStorage contract...")
    const QStorage = await ethers.getContractFactory("contracts/QueryDataStorage.sol:QueryDataStorage", wallet)
    const qstoragewithsigner = await QStorage.connect(wallet)
    const qstorage = await qstoragewithsigner.deploy()
    await qstorage.deployed();
    console.log("QueryDataStorage contract deployed to: ", qstorage.address)

    if (net == "mainnet"){
        console.log("QueryDataStorage contract deployed to:", "https://etherscan.io/address/" + qstorage.address);
        console.log("    transaction hash:", "https://etherscan.io/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "rinkeby") {
        console.log("QueryDataStorage contract deployed to:", "https://rinkeby.etherscan.io/address/" + qstorage.address);
        console.log("    transaction hash:", "https://rinkeby.etherscan.io/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "bsc_testnet") {
        console.log("QueryDataStorage contract deployed to:", "https://testnet.bscscan.com/address/" + qstorage.address);
        console.log("    transaction hash:", "https://testnet.bscscan.com/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "bsc") {
        console.log("QueryDataStorage contract deployed to:", "https://bscscan.com/address/" + qstorage.address);
        console.log("    transaction hash:", "https://bscscan.com/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "polygon") {
        console.log("QueryDataStorage contract deployed to:", "https://polygonscan.com/address/" + qstorage.address);
        console.log("    transaction hash:", "https://polygonscan.com/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "mumbai") {
        console.log("QueryDataStorage contract deployed to:", "https://mumbai.polygonscan.com/address/" + qstorage.address);
        console.log("    transaction hash:", "https://mumbai.polygonscan.com/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "arbitrum_testnet"){
        console.log("QueryDataStorage contract deployed to:","https://rinkeby-explorer.arbitrum.io/#/"+ qstorage.address)
        console.log("    transaction hash:", "https://rinkeby-explorer.arbitrum.io/#/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "harmony_testnet"){
        console.log("QueryDataStorage contract deployed to:","https://explorer.pops.one/address/"+ qstorage.address)
        console.log("    transaction hash:", "https://explorer.pops.one/txt/" + qstorage.deployTransaction.hash);
    } else if (net == "harmony_mainnet"){
        console.log("QueryDataStorage contract deployed to:","https://explorer.harmony.one/address/"+ qstorage.address)
        console.log("    transaction hash:", "https://explorer.harmony.one/txt/" + qstorage.deployTransaction.hash);
    } else if (net == "xdaiSokol"){ //https://blockscout.com/poa/xdai/address/
      console.log("QueryDataStorage contract deployed to:","https://blockscout.com/poa/sokol/address/"+ qstorage.address)
      console.log("    transaction hash:", "https://blockscout.com/poa/sokol/tx/" + qstorage.deployTransaction.hash);
    } else if (net == "xdai"){ //https://blockscout.com/poa/xdai/address/
      console.log("QueryDataStorage contract deployed to:","https://blockscout.com/xdai/mainnet/address/"+ qstorage.address)
      console.log("    transaction hash:", "https://blockscout.com/xdai/mainnet/tx/" + qstorage.deployTransaction.hash);
    } else if(net == "pulse_testnet") {
        console.log("QueryDataStorage contract deployed to:","https://scan.v4.testnet.pulsechain.com/address/"+ qstorage.address)
        console.log("    transaction hash:", "https://scan.v4.testnet.pulsechain.com/tx/" + qstorage.deployTransaction.hash);
    } else if(net == "pulse_mainnet") {
        console.log("QueryDataStorage contract deployed to:","https://scan.pulsechain.com/address/"+ qstorage.address)
        console.log("    transaction hash:", "https://scan.pulsechain.com/tx/" + qstorage.deployTransaction.hash);
    } else {
        console.log("Please add network explorer details")
    }

    /////////////autopay
    console.log("Starting deployment for Autopay contract...")
    const Autopay = await ethers.getContractFactory("contracts/Autopay.sol:Autopay", wallet)
    const autopaywithsigner = await Autopay.connect(wallet)
    const autopay = await autopaywithsigner.deploy(fetchAdd, qstorage.address)
    await autopay.deployed();
    console.log("Autopay contract deployed to: ", autopay.address)

    if (net == "mainnet"){
        console.log("Autopay contract deployed to:", "https://etherscan.io/address/" + autopay.address);
        console.log("    transaction hash:", "https://etherscan.io/tx/" + autopay.deployTransaction.hash);
    } else if (net == "rinkeby") {
        console.log("Autopay contract deployed to:", "https://rinkeby.etherscan.io/address/" + autopay.address);
        console.log("    transaction hash:", "https://rinkeby.etherscan.io/tx/" + autopay.deployTransaction.hash);
    } else if (net == "bsc_testnet") {
        console.log("Autopay contract deployed to:", "https://testnet.bscscan.com/address/" + autopay.address);
        console.log("    transaction hash:", "https://testnet.bscscan.com/tx/" + autopay.deployTransaction.hash);
    } else if (net == "bsc") {
        console.log("Autopay contract deployed to:", "https://bscscan.com/address/" + autopay.address);
        console.log("    transaction hash:", "https://bscscan.com/tx/" + autopay.deployTransaction.hash);
    } else if (net == "polygon") {
        console.log("Autopay contract deployed to:", "https://polygonscan.com/address/" + autopay.address);
        console.log("    transaction hash:", "https://polygonscan.com/tx/" + autopay.deployTransaction.hash);
    } else if (net == "mumbai") {
        console.log("Autopay contract deployed to:", "https://mumbai.polygonscan.com/address/" + autopay.address);
        console.log("    transaction hash:", "https://mumbai.polygonscan.com/tx/" + autopay.deployTransaction.hash);
    } else if (net == "arbitrum_testnet"){
        console.log("Autopay contract deployed to:","https://rinkeby-explorer.arbitrum.io/#/"+ autopay.address)
        console.log("    transaction hash:", "https://rinkeby-explorer.arbitrum.io/#/tx/" + autopay.deployTransaction.hash);
    } else if (net == "harmony_testnet"){
        console.log("Autopay contract deployed to:","https://explorer.pops.one/address/"+ autopay.address)
        console.log("    transaction hash:", "https://explorer.pops.one/txt/" + autopay.deployTransaction.hash);
    } else if (net == "harmony_mainnet"){
        console.log("Autopay contract deployed to:","https://explorer.harmony.one/address/"+ autopay.address)
        console.log("    transaction hash:", "https://explorer.harmony.one/txt/" + autopay.deployTransaction.hash);
    } else if (net == "xdaiSokol"){ //https://blockscout.com/poa/xdai/address/
      console.log("Autopay contract deployed to:","https://blockscout.com/poa/sokol/address/"+ autopay.address)
      console.log("    transaction hash:", "https://blockscout.com/poa/sokol/tx/" + autopay.deployTransaction.hash);
    } else if (net == "xdai"){ //https://blockscout.com/poa/xdai/address/
      console.log("Autopay contract deployed to:","https://blockscout.com/xdai/mainnet/address/"+ autopay.address)
      console.log("    transaction hash:", "https://blockscout.com/xdai/mainnet/tx/" + autopay.deployTransaction.hash);
    } else if (net == "pulse_testnet") {
        console.log("Autopay contract deployed to:","https://scan.v4.testnet.pulsechain.com/address/"+ autopay.address)
        console.log("    transaction hash:", "https://scan.v4.testnet.pulsechain.com/tx/" + autopay.deployTransaction.hash);
    } else {
        console.log("Please add network explorer details")
    }

    // Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for QueryDataStorage tx confirmation...');
    await qstorage.deployTransaction.wait(7)

    console.log("Autopay contract deployed")

    // Wait for few confirmed transactions.
    // Otherwise the etherscan api doesn't find the deployed contract.
    console.log('waiting for Autopay tx confirmation...');
    await autopay.deployTransaction.wait(7)

    console.log("Autopay contract deployed")

}

const nodeUrls = {
    pulse_testnet: process.env.NODE_URL_PULSECHAIN_TESTNET,
    pulse_mainnet: process.env.NODE_URL_PULSECHAIN_MAINNET
}

const network = process.env.NETWORK
const node_url_pulsechain = nodeUrls[network]

if (!node_url_pulsechain) {
    console.log("Error: please add NETWORK=pulse_testnet|pulse_mainnet in .env")
    process.exit(1)
}

deployAutopay(network, process.env.PRIVATE_KEY, node_url_pulsechain, fetchAddress)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
*/