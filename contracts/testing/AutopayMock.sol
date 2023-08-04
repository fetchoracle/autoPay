// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "../Autopay.sol";

contract AutopayMock is Autopay {
    constructor(
        address payable _fetch,
        address _queryDataStorage
        ) Autopay(_fetch, _queryDataStorage) {}
    
    function bytesToUint(bytes memory _b) public pure returns(uint256) {
        return _bytesToUint(_b);
    }
}