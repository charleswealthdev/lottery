// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager = msg.sender;
    address[] public players;
    address[] public winners;
    bool public countdownStatus;
    mapping(address => uint) public winnerCounts;
    uint public prize;
    address public winner;

    event WinnerPicked(address winner, uint256 index, uint256 prize);
    event Status(string status);

    function getManager() public view returns (address) {
        return manager;
    }

    function joinGame() external payable {
        require(msg.value == 0.05 ether, "Incorrect ether value sent");
        require(players.length < 10, "Maximum number of players reached");
        for (uint256 i = 0; i < players.length; i++) {
            require(players[i] != msg.sender, "You are already a participant in the game.");
        }
        players.push(payable(msg.sender));
    }

    function viewPlayers() public view returns (address[] memory) {
        return players;
    }


    function random() internal view returns (uint) {
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
    require(players.length >= 3, "This lottery needs more than 3 players");
    uint index = random() % players.length;
    winner = players[index];
    winnerCounts[winner]++;
    prize = address(this).balance;

    // Instead of transferring funds immediately, keep them in the contract
    // until the winner explicitly claims the prize using the transferPrize function.
    
    emit WinnerPicked(winner, index, prize);
    
    return winner;
}

function transferPrize() public {
    require(msg.sender == winner, "Only the winner can claim the prize");
    
    // Ensure that the winner is set before attempting to transfer the prize
    require(winner != address(0), "Winner address not set");

    // Check if there is a prize to transfer
    require(prize > 0, "No prize available to transfer");

    // Transfer the prize to the winner
    payable(winner).transfer(prize);

    // Record the winner and reset for the next round
    winners.push(winner);
    startAgain();
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
