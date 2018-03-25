pragma solidity ^0.4.2;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./EventTicketBase.sol";


// TODO: Add support for dai, potentially with kyber
// TODO: Use dai oracle and make the price in USD
// TODO: user registration with civic, uport, etc
// TODO: tiered pricing
// TODO: allow reselling for less than ticket price
// TODO: handle date of the event
// TODO: reputation system
// TODO: image upload with ipfs

// Type 1:
// Single Price (no tiers)
// Max tickets purchased at a time
contract EventTicketType1 is EventTicketBase{

    using SafeMath for uint256;

    uint256 public maxTicketsPerWallet;
    uint256 public price;


    event Debug(address addr);

    function EventTicketType1(address _creator, string _description, uint256 _total, uint256 _max, uint256 _price) public 
        EventTicketBase(_creator, _description, _total)
    {
        maxTicketsPerWallet = _max;
        price = _price;
    }


    modifier maxAllowed(address _to, uint256 _quantity){
        require(balanceOf(_to).add(_quantity) <= maxTicketsPerWallet);
        _;
    }


    function determineTicketPrice(uint256 _tokenId) internal returns(uint256){
        return price;
    }

    function mint(address _recipient, uint256 _quantity, uint256 _amountPaid) public parentOnly canCreateNewTickets(_quantity) maxAllowed(_recipient, _quantity){
        super.mint(_recipient, _quantity, _amountPaid);
    }

    function setPrice(uint256 _price) public creatorOnly(){
        price = _price;
    }
    

    function transfer(address _to, uint256 _tokenId) public maxAllowed(_to,1) onlyOwnerOf(_tokenId) escrowPaidForToken(_to, _tokenId){
      super.transfer(_to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public maxAllowed(msg.sender,1) escrowPaidForToken(msg.sender, _tokenId){
      super.takeOwnership(_tokenId);
    }
    
}
