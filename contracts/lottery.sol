// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager;
    address[] public players;
    address[] public winners;


    mapping(address => Player) public Tplayer;
    address public winner;
    uint public prize;
    uint public constant amount = 0.05 ether;
    uint public TVolume;
    uint public TX;

    struct Player {
        uint timeplayed;
        uint wins;
        uint losses;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    modifier onlyWinner(){
        require(msg.sender == winner,"only winner can claim");
        _;
    }
   
    event WinnerPicked(address winner, uint256 prize);

    constructor() {
        manager = msg.sender;
    }


function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // function getTV() public view returns(uint){
    //     return TVolume;
    // }

    // function TXtimes() public view returns(uint){
    //     return TX;
    // }
//     function timesPlayed() public view returns(uint){
//         return Tplayer[msg.sender].timeplayed;
//     }
//   function timesWon() public view returns(uint){
//         return Tplayer[msg.sender].wins;
//     }

     function getPlayerStats(address player) public view returns (uint wins, uint losses, uint timePlayed) {
        Player storage playerInfo = Tplayer[player];
        return (playerInfo.wins, playerInfo.losses, playerInfo.timeplayed);
    }

// function timesLost() public view returns(uint){
//         return Tplayer[msg.sender].losses;
//     }

    function joinGame() external payable  {
        require(msg.value == amount, "Incorrect ether value sent");
        require(players.length < 100, "Maximum number of players reached");
  for (uint256 i = 0; i < players.length; i++) {
            require(players[i] != msg.sender, "You are already a participant in the game.");
        }
        players.push(msg.sender);
         TVolume += msg.value;
        TX++;
        Player storage newPlayer = Tplayer[msg.sender];
        newPlayer.timeplayed++;
    }

    function pickWinner() public onlyManager {
        require(players.length >= 3, "This lottery needs more than 3 players");

        uint index = random() % players.length;
         winner = players[index];

        Tplayer[winner].wins++;
        TX++;

        for (uint i = 0; i < players.length; i++) {
            if (i != index) {
                Tplayer[players[i]].losses++;
            }
        }

        prize = address(this).balance;
        winners.push(winner);
        emit WinnerPicked(winner, prize);

        // Reset the game
        resetGame();
    }

    function transferPrize() public onlyWinner {
        require(prize > 0, "No prize to transfer");
         TVolume+=prize;
        payable(winners[winners.length - 1]).transfer(prize);
       
        TX++;
        prize = 0; // Reset prize after transfer
        
    }
function viewPlayers() public view returns (address[] memory) {
        return players;
    }
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, players)));
    }

    function resetGame() private {
        delete players;
    }

    function getWinCount(address player) public view returns (uint) {
        return Tplayer[player].wins;
    }

    function viewPastWinners() public view returns (address[] memory) {
        return winners;
    }
}
