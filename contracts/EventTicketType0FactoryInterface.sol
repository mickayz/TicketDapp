pragma solidity ^0.4.2;

contract EventTicketType0FactoryInterface{
    function newEvent(
        address _parent, 
        address _creator, 
        string _description, 
        uint256 _total, 
        uint256 _max, 
        uint256 _price
        ) external returns(address);
}
