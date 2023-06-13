[![Tests](https://github.com/fetchoracle/autopay/actions/workflows/tests.yml/badge.svg)](https://github.com/fetchoracle/autopay/actions/workflows/tests.ymli)

## Overview <a name="overview"> </a>  

<b>Autopay</b> is a system for creating and funding data feeds for use with Fetch. 

## To Use

### Create a recurring data feed

Run `setUpFeed` then `fundFeed`

```solidity 

    /**
     * @param _queryId unique identifier of desired data feed
     * @param _reward tip amount per eligible data submission
     * @param _startTime timestamp of first autopay window
     * @param _interval amount of time between autopay windows
     * @param _window amount of time after each new interval when reports are eligible for tips
     * @param _priceThreshold amount price must change to automate update regardless of time (negated if 0, 100 = 1%)
     * @param _queryData the data used by reporters to fulfill the query
    function setupDataFeed(
        bytes32 _queryId,
        uint256 _reward,
        uint256 _startTime,
        uint256 _interval,
        uint256 _window,
        uint256 _priceThreshold,
        bytes calldata _queryData
    )

    .......


    /**
     * @param _feedId unique feed identifier
     * @param _queryId identifier of reported data type associated with feed
     * @param _amount quantity of tokens to fund feed
     */
    function fundFeed(
        bytes32 _feedId,
        bytes32 _queryId,
        uint256 _amount
    ) 

```

### Tip a Query ID

To tip a queryId, giving the tip to the next reporter to sumbit for that ID, run:

```solidity 

    /** 
     * @param _queryId ID of tipped data
     * @param _amount amount to tip
     * @param _queryData the data used by reporters to fulfill the query
     */
    function tip(
        bytes32 _queryId,
        uint256 _amount,
        bytes calldata _queryData
    ) external {

```


### Receive rewards as a reporter

To receive fees from a recurring feed: 

```solidity 

    /**
     * @param _reporter address of Fetch reporter
     * @param _feedId unique feed identifier
     * @param _queryId ID of reported data
     * @param _timestamps[] batch of timestamps array of reported data eligible for reward
     */
    function claimTip(
        address _reporter,
        bytes32 _feedId,
        bytes32 _queryId,
        uint256[] memory _timestamps
    )

```

To receive fees from a one time tip: 

```solidity 

    /**
     * @param _queryId ID of reported data
     * @param _timestamps[] batch of timestamps array of reported data eligible for reward
     */
    function claimOneTimeTip(
        bytes32 _queryId,
        uint256[] calldata _timestamps
    )

```

## Setting up and testing

Install Dependencies
```
npm i
```

Install local dependencies. This project depends on usingFetch project. To install it, clone the repository in the same folder level than autoPay project.

```
git clone git@github.com:fetchoracle/usingfetch.git
```

Compile Smart Contracts
```
npx hardhat compile
```

Test Locally
```
npx hardhat test
```

## Maintainers <a name="maintainers"> </a>
This repository is maintained by the [Fetch team](https://github.com/orgs/fetchoracle/people)


## How to Contribute<a name="how2contribute"> </a>  

Check out our issues log here on Github or feel free to reach out anytime [info@fetchoracle.com](mailto:info@fetchoracle.com)

## Deploy

Set the env variable in the .env file. Rename .env.example to .env and set the private key of the deployer, RPC url, chain Id and the network (pulse_testnet or pulse_mainnet). The example below show the values for Pulsechain testnet.

```
PRIVATE_KEY=
NETWORK=pulse_testnet
NODE_URL_PULSECHAIN_TESTNET=https://rpc.v4.testnet.pulsechain.com
CHAIN_ID_PULSECHAIN_TESTNET=943
```

Please notice that for deploying AutoPay contract the Fetch Flex oracle address is needed. It need to be configured inside scripts/deploy.js file in this variables:

```
var fetchAddress = ''
```

For deploying autopay to Pulsechain testnet run the script below:

```
npx hardhat run scripts/deploy.js 
```

The current version of the autopay contract is deployed in PulseChain testnet in this address:

[0x3bb78c986c0Ad35f4BEC284e7c2C3d2808C05432](https://scan.v4.testnet.pulsechain.com/address/0x3bb78c986c0Ad35f4BEC284e7c2C3d2808C05432)
## Copyright

Fetch Inc. 2023
