pragma solidity ^0.4.2;

import "./EventTicketType0.sol";
import "./EventTicketType0FactoryInterface.sol";

contract EventTicketType0Factory is EventTicketType0FactoryInterface{
        
    function newEvent(address _parent, address _creator, string _description, uint256 _total, uint256 _max, uint256 _price) external returns(address){
        return new EventTicketType0(_parent, _creator, _description, _total, _max, _price);
    }
}