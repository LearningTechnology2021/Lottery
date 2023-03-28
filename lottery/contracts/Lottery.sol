//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract Lottery {
    address public manager;
    address payable [] public players;
    
    constructor()  {
        manager = msg.sender;
    }
    //Enters current user address to array
    //checks that they have at least the minimum
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }
    
    function random() private view returns (uint) {
        //Not a good way to create random number certainly not secure
        //Would now use Chainlink to get randome number
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }
    
    function pickWinner() public restricted {
        //restricted to the manager
        uint index = random() % players.length;//uses the above random generator
        players[index].transfer(address(this).balance);//sends payment to winning address
        players = new address payable[](0);//Clears the players array
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address payable[] memory ) {
        return players;
    }
}   