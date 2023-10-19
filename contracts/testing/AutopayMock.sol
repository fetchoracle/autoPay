// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "../Autopay.sol";

contract AutopayMock is Autopay {
    function bytesToUint(bytes memory _b) public pure returns(uint256) {
        return _bytesToUint(_b);
    }
}