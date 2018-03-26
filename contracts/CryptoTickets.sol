pragma solidity ^0.4.2;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";

import './EventTicketInterface.sol';

// TODO probably use a factory for these
import './EventTicketType1.sol';


contract CryptoTickets is Ownable{

    using SafeMath for uint256;

    mapping(address=>address) internal eventToCreator; 
    mapping(address=>address[]) internal creatorToEvents;
    address[] public events;

    // denominator of fee percent
    // ie 100==1% fee, 1000==0.1%, etc
    uint256 public feeDenominator;

    event NewEvent(address addr);
    event TicketPurchased(address addr);

    function CryptoTickets(uint256 _fee) public {
        setFee(_fee);
    }

    function setFee(uint256 _fee) public onlyOwner{
        feeDenominator = _fee;
    }
    
    function addEvent(address _newEvent) private{
        eventToCreator[_newEvent] = msg.sender;
        creatorToEvents[msg.sender].push(_newEvent);
        events.push(_newEvent);

        NewEvent(_newEvent);
    }

    // Type 1 event has the following:
    // - max tickets per wallet purchase
    // - single tier pricing
    // - no image upload
    // - non refundable
    // - does not require registration
    // - does not support whitelist/blacklisting purchasers
    // - only accepts ETH
    // - priced in ETH

    function createEventType1(string _description, uint256 _total, uint256 _max, uint256 _price) external returns(address) {
        address newEvent = new EventTicketType1(msg.sender, _description, _total, _max, _price);
        addEvent(newEvent);
        return newEvent;
    }

    function buyTicket(address _event, uint256 _quantity) payable external{
        require(feeDenominator != 0);
        EventTicketInterface currentEvent = EventTicketInterface(_event);
        
        uint256 fee = msg.value.div(feeDenominator);

        currentEvent.mint(msg.sender,_quantity,msg.value);
        
        // transfer fee to developer
        owner.transfer(fee);
        // transfer payment to creator
        eventToCreator[_event].transfer(msg.value-fee);
        
        TicketPurchased(currentEvent);
        
    }
    
    function getEventCountForCreator(address _creator) public view returns(uint256){
        return creatorToEvents[_creator].length;
    }
    
    function getEventForCreator(address _creator, uint256 _index) public view returns(address){
        return creatorToEvents[_creator][_index];    
    }
    
    function eventCount() public view returns(uint256){
        return events.length;        
    }


}




