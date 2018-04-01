pragma solidity ^0.4.2;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract EventTicketInterface is ERC721{
 
 function determineTicketPrice(uint256 _tokenId) internal returns(uint256);
 
 function ticketsRemaining() public view returns(uint256);
 function getCreator() public view returns(address);

 function mint(address _recipient, uint256 _quantity, uint256 _amountPaid) public;
 function setDescription(string _description) public;
 function totalTickets() public view returns (uint256);
 function payEscrow(uint256 _tokenId) payable public;
 function withdrawEscrow() public;
 
 // TODO something for setting price
}
