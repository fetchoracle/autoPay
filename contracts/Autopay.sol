// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

/**
 @author Tellor Inc.
 @title Autopay
 @dev This is contract for automatically paying for Tellor oracle data at
 * specific time intervals. Any non-rebasing ERC20 token can be used for payment.
 * Only the first data submission within each time window gets a reward.
*/
import "usingtellor/contracts/UsingTellor.sol";
import "./interfaces/IERC20.sol";

contract Autopay is UsingTellor {
    ITellor public master; // Tellor contract address
    address public owner;
    uint256 public fee; // 1000 is 100%, 50 is 5%, etc.

    mapping(bytes32 => mapping(bytes32 => Feed)) dataFeed; // mapping queryID to dataFeedID to details
    mapping(bytes32 => bytes32[]) currentFeeds; // mapping queryID to dataFeedIDs array
    mapping(bytes32 => mapping(address => Tip[])) public tips; // mapping queryID to token address to tips

    struct FeedDetails {
        address token; // token used for tipping
        uint256 reward; // amount paid for each eligible data submission
        uint256 balance; // account remaining balance
        uint256 startTime; // time of first payment window
        uint256 interval; // time between pay periods
        uint256 window; // amount of time data can be submitted per interval
    }

    struct Feed{
        FeedDetails details;
        mapping(uint256 => bool) rewardClaimed; // tracks which tips were already paid out
    }

    struct Tip {
      uint256 amount;
      uint256 timestamp;
    }

    // Events
    event NewDataFeed(address _token,bytes32 _queryId,bytes32 _feedId,bytes _queryData);
    event DataFeedFunded(bytes32 _queryId,bytes32 _feedId,uint256 _amount);
    event TipAdded(address _token, bytes32 _queryId,uint256 _amount);
    event TipClaimed(bytes32 _feedId,bytes32 _queryId,address _token,uint256 _amount);

    /**
     * @dev Initializes system parameters
     * @param _tellor address of Tellor contract
     */
    constructor(address payable _tellor, address _owner,uint256 _fee) UsingTellor(_tellor) {
        master = ITellor(_tellor);
        owner = _owner;
        fee = _fee;
    }

    /**
     * @dev Allows Tellor reporters to claim their tips in batches
     * @param _reporter address of Tellor reporter
     * @param _feedId unique dataFeed Id
     * @param _queryId id of reported data
     * @param _timestamps[] timestamps array of reported data eligible for reward
     */
    function claimTip(
        address _reporter,
        bytes32 _feedId,
        bytes32 _queryId,
        uint256[] memory _timestamps
    ) external {
        address _reporterAtTimestamp;
        uint256 _reward;
        uint256  _cumulativeReward;
        FeedDetails storage _feed = dataFeed[_queryId][_feedId].details;
        for (uint256 i = 0; i < _timestamps.length; i++) {
            (_reporterAtTimestamp, _reward) = _claimTip(
                _feedId,
                _queryId,
                _timestamps[i]
            );
            require(_reporterAtTimestamp == _reporter, "reporter mismatch");
            _cumulativeReward += _reward;
        }
        // if(tips[_queryId][_feed.token] > 0){
        //     _cumulativeReward += tips[_queryId][_feed.token];
        //     tips[_queryId][_feed.token] = 0;
        // }
        IERC20(_feed.token).transfer(
            _reporter,
            _cumulativeReward - ((_cumulativeReward * fee)/1000)
        );
        IERC20(_feed.token).transfer(
            owner,
            (_cumulativeReward * fee)/1000
        );
        emit TipClaimed(_feedId,_queryId,_feed.token,_cumulativeReward);
    }

    /**
     * @dev Allows dataFeed account to be filled with tokens
     * @param _feedId unique dataFeed Id for queryId
     * @param _queryId id of reported data associated with feed
     * @param _amount quantity of tokens to fund feed account
     */
    function fundFeed(bytes32 _feedId,bytes32 _queryId,uint256 _amount) external {
        FeedDetails storage _feed = dataFeed[_queryId][_feedId].details;
        require(_feed.reward > 0,"feed not set up");
        require(
            IERC20(_feed.token).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "ERC20: transfer amount exceeds balance"
        );
        _feed.balance += _amount;
        emit DataFeedFunded(_feedId,_queryId,_amount);
    }

    /**
     * @dev Initializes dataFeed parameters.
     * @param _token address of ERC20 token used for tipping
     * @param _queryId id of specific desired data feet
     * @param _reward tip amount per eligible data submission
     * @param _startTime timestamp of first autopay window
     * @param _interval amount of time between autopay windows
     * @param _window amount of time after each new interval when reports are eligible for tips
     */
    function setupDataFeed(
        address _token,
        bytes32 _queryId,
        uint256 _reward,
        uint256 _startTime,
        uint256 _interval,
        uint256 _window,
        bytes memory _queryData
    ) external {
        require(
            _queryId == keccak256(_queryData) || uint256(_queryId) <= 100,
            "id must be hash of bytes data"
        );
        bytes32 _feedId = keccak256(abi.encode(_queryId,_token,_reward,_startTime,_interval,_window));
        FeedDetails storage _feed = dataFeed[_queryId][_feedId].details;
        require(_feed.reward == 0, "feed must not be set up already");
        require(_reward > 0, "reward must be greater than zero");
        require(
            _window < _interval,
            "window must be less than interval length"
        );
        _feed.token = _token;
        _feed.reward = _reward;
        _feed.startTime = _startTime;
        _feed.interval = _interval;
        _feed.window = _window;
        currentFeeds[_queryId].push(_feedId);
        emit NewDataFeed(_token, _queryId, _feedId, _queryData);
    }

    function tip(address _token,bytes32 _queryId,uint256 _amount) external {
        require(
            IERC20(_token).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "ERC20: transfer amount exceeds balance"
        );
        Tip[] storage _tips = tips[_queryId][_token];
        if (_tips.length == 0) {
            _tips.push(Tip(_amount, block.timestamp));
        } else {
            (,, uint256 _timestampRetrieved) = getCurrentValue(_queryId);
            if (_timestampRetrieved < _tips[_tips.length - 1].timestamp) {
                _tips[_tips.length - 1].timestamp = block.timestamp;
                _tips[_tips.length - 1].amount += _amount;
            } else {
                _tips.push(Tip(_amount, block.timestamp));
            }
        }
        emit TipAdded(_token,_queryId,_amount);
    }

    function claimOneTimeTip(address _token, bytes32 _queryId, uint256 _timestamp) external {
        Tip[] storage _tips = tips[_queryId][_token];
        require(_tips.length > 0, "No tips submitted for this token and queryId");
        address _reporter = master.getReporterByTimestamp(_queryId, _timestamp);
        require(msg.sender == _reporter, "Message sender not reporter for given queryId and timestamp");
        uint256 _min;
        uint256 _max = _tips.length;
        uint256 _mid;

        while(_max - _min > 1) {
            _mid = (_max + _min) / 2;
            if(_tips[_mid].timestamp > _timestamp) {
                _max = _mid;
            } else {
                _min = _mid;
            }
        }

        (,, uint256 _timestampBefore) = getDataBefore(_queryId, _timestamp);
        require(_timestampBefore < _tips[_min].timestamp, "Tip earned by previous submission");
        require(_timestamp > _tips[_min].timestamp, "Timestamp not eligible for tip");
        require(_tips[_min].amount > 0, "Tip already claimed");
        uint256 _tipAmount = _tips[_min].amount;
        _tips[_min].amount = 0;
        IERC20(_token).transfer(_reporter, _tipAmount);
    }

    function getCurrentFeeds(bytes32 _queryId) external view returns(bytes32[] memory){
        return currentFeeds[_queryId];
    }

    /**
     * @dev Getter function to read a specific dataFeed
     * @param _feedId unique feedId of parameters
     * @param _queryId id of reported data
     * @return FeedDetails details of specified feed
     */
    function getDataFeed(bytes32 _feedId, bytes32 _queryId)
        external
        view
        returns (FeedDetails memory)
    {
        return (dataFeed[_queryId][_feedId].details);
    }

    /**
     * @dev Getter function to read if a reward has been claimed
     * @param _feedId feedId of dataFeed
     * @param _queryId id of reported data
     * @param _timestamp id or reported data
     * @return bool rewardClaimed
     */
    function getRewardClaimedStatus(
        bytes32 _feedId,
        bytes32 _queryId,
        uint256 _timestamp
    ) external view returns (bool) {
        return dataFeed[_queryId][_feedId].rewardClaimed[_timestamp];
    }

    function getCurrentTip(bytes32 _queryId, address _token) external view returns(uint256){
        (,, uint256 _timestampRetrieved) = getCurrentValue(_queryId);
        Tip memory _lastTip = tips[_queryId][_token][tips[_queryId][_token].length - 1];
        if (_timestampRetrieved < _lastTip.timestamp) {
          return _lastTip.amount;
        } else {
          return 0;
        }
    }

    function getPastTips(bytes32 _queryId, address _token) external view returns(Tip[] memory) {
        return tips[_queryId][_token];
    }

    /**
     * @dev Internal function which allows Tellor reporters to claim their tips
     * @param _feedId of dataFeed
     * @param _queryId id of reported data
     * @param _timestamp timestamp of reported data eligible for reward
     * @return address reporter
     * @return uint256 reward amount
     */
    function _claimTip(
        bytes32 _feedId,
        bytes32 _queryId,
        uint256 _timestamp
    ) internal returns (address, uint256) {
        Feed storage _feed = dataFeed[_queryId][_feedId];
        require(_feed.details.balance > 0, "insufficient feed balance");
        require(!_feed.rewardClaimed[_timestamp], "reward already claimed");
        require(block.timestamp - _timestamp > 12 hours,"buffer time has not passed");
        // ITellor _oracle = ITellor(master.addresses(keccak256(abi.encode("_ORACLE_CONTRACT")))); // use this for tellorX
        address _reporter = master.getReporterByTimestamp(_queryId, _timestamp);
        require(_reporter != address(0), "no value exists at timestamp");
        uint256 _n = (_timestamp - _feed.details.startTime) / _feed.details.interval; // finds closest interval _n to timestamp
        uint256 _c = _feed.details.startTime + _feed.details.interval * _n; // finds timestamp _c of interval _n
        require(_timestamp - _c < _feed.details.window, "timestamp not within window");
        (, , uint256 _timestampBefore) = getDataBefore(_queryId, _timestamp);
        require(
            _timestampBefore < _c,
            "timestamp not first report within window"
        );
        uint256 _rewardAmount;
        if (_feed.details.balance >= _feed.details.reward) {
            _rewardAmount = _feed.details.reward;
            _feed.details.balance -= _feed.details.reward;
        } else {
            _rewardAmount = _feed.details.balance;
            _feed.details.balance = 0;
        }
        _feed.rewardClaimed[_timestamp] = true;
        return (_reporter, _rewardAmount);
    }
}
