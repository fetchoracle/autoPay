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

Check out our issues log here on Github or feel free to reach out anytime [info@fetch.io](mailto:info@fetch.io)

## Deploy

For deploying autopay run the script below:

```
npx hardhat run scripts/deploy.js --network pulsev3_testnet

```

The current version of the autopay contract is deployed in PulseChain testnet V3 in this address:

[0x6a76FEb976Afa32A42ec9ccFE40F4DbDECF1C352](https://scan.v3.testnet.pulsechain.com/address/0x6a76FEb976Afa32A42ec9ccFE40F4DbDECF1C352)

## Copyright

Fetch Inc. 2022
