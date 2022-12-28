// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public winner;

    event PlayedJoined(address player);
    event Winner(address player);
    error JoinOnce(address player, string errorMessage);

    constructor() {
        manager = msg.sender;
    }

    modifier isManager() {
        require(msg.sender == manager, "Not allowed");
        _;
    }

    function reset() private {
        // delete players;
        players = new address[](0);
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
        emit PlayedJoined(msg.sender);
    }

    function getPlayers() public view isManager returns (address[] memory) {
        return players;
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            ) % players.length;
    }

    function pickWinner() public isManager {
        uint index = random();
        winner = players[index];
        emit Winner(winner);
        payable(winner).transfer((address(this).balance * 90) / 100);
        reset();
    }

    function balance() public view isManager returns (uint256) {
        return address(this).balance;
    }

    function withdrawal() public isManager {
        require(address(this).balance > 0);
        payable(manager).transfer(address(this).balance);
    }
}
