// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager = msg.sender;
    address[] public players;
    address[] public winners;
    bool public countdownStatus;
    mapping(address => uint) public winnerCounts;

    event WinnerPicked(address winner, uint256 index, uint256 prize);
    event Status(string status);

    function getManager() public view returns (address) {
        return manager;
    }

    function joinGame() external payable {
        require(msg.value == 0.005 ether, "Incorrect ether value sent");
        require(players.length < 10, "Maximum number of players reached");
        for (uint256 i = 0; i < players.length; i++) {
            require(players[i] != msg.sender, "You are already a participant in the game.");
        }
        players.push(payable(msg.sender));
    }

    function viewPlayers() public view returns (address[] memory) {
        return players;
    }

    function checkCountdown() public {
        require(!countdownStatus, "Countdown has not completed");
        countdownStatus = true;
        string memory status = "done";
        emit Status(status);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, players)));
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    function pickWinner() public returns (address) {
        require(countdownStatus, "Countdown not completed");
        require(players.length >= 3, "This lottery needs more than 3 players");
        uint index = random() % players.length;
        address winner = players[index];
        winnerCounts[winner]++;
        uint prize = address(this).balance;
        payable(winner).transfer(prize);
        winners.push(winner);
        emit WinnerPicked(winner, index, prize);
        startAgain();
        countdownStatus = false;
        return winner;
    }

    function getWinCount(address player) public view returns (uint) {
        return winnerCounts[player];
    }

    function viewPastWinners() public view returns (address[] memory) {
        return winners;
    }

    function startAgain() private {
        players = new address[](0);
    }
}
