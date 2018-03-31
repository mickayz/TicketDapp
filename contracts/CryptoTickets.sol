pragma solidity ^0.4.2;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";

import './EventTicketInterface.sol';

// TODO probably use a factory for these
import './EventTicketType0.sol';


contract CryptoTickets is Ownable{

    using SafeMath for uint256;

    struct TicketEvent{
        uint256 id;
        uint256 ticketType;
        address contractAddr;
        address creator;
    }
    
    uint256 public numEvents;
    mapping(uint256 => TicketEvent) public ticketEvents;
    mapping(address => uint256) internal contractToId;
    mapping(address => uint256[]) internal creatorToEvents;

    mapping(address => string) public usernames;


    // denominator of fee percent
    // ie 100==1% fee, 1000==0.1%, etc
    uint256 public feeDenominator;

    event NewEvent(uint256 id);
    event TicketPurchased(address addr);
    event UsernameSet(address addr, string name);

    function CryptoTickets(uint256 _fee) public {
        setFee(_fee);
    }

    function setUsername(string _name) public {
        usernames[msg.sender] = _name;
        
        UsernameSet(msg.sender, _name);
    }


    function setFee(uint256 _fee) public onlyOwner{
        feeDenominator = _fee;
    }
    
    function addEvent(address _newEventAddr, uint256 _ticketType) private{
        uint256 eventId = numEvents++;
        ticketEvents[eventId] = TicketEvent(eventId, _ticketType, _newEventAddr, msg.sender);
        contractToId[_newEventAddr] = eventId;
        creatorToEvents[msg.sender].push(eventId);
        
        NewEvent(eventId);
    }

    // Type 1 event has the following:
    // - max tickets per wallet
    // - single tier pricing
    // - no image upload
    // - non refundable
    // - does not require registration
    // - does not support whitelist/blacklisting purchasers
    // - only accepts ETH
    // - priced in ETH
    // - tradeable for less than or equal to face value
    function createEventType0(string _description, uint256 _total, uint256 _max, uint256 _price) external returns(address) {
        address newEvent = new EventTicketType0(msg.sender, _description, _total, _max, _price);
        addEvent(newEvent,0);
        return newEvent;
    }

    function buyTicket(uint256 _id, uint256 _quantity) payable external{
        require(feeDenominator != 0);
        EventTicketInterface currentEvent = EventTicketInterface(ticketEvents[_id].contractAddr);
        
        uint256 fee = msg.value.div(feeDenominator);

        currentEvent.mint(msg.sender,_quantity,msg.value);
        
        // transfer fee to developer
        owner.transfer(fee);
        // transfer payment to creator
        ticketEvents[_id].creator.transfer(msg.value-fee);
        
        TicketPurchased(currentEvent);
        
    }
    
    function getEventCountForCreator(address _creator) public view returns(uint256){
        return creatorToEvents[_creator].length;
    }
    
    function getEventForCreator(address _creator, uint256 _index) public view returns(uint256){
        return creatorToEvents[_creator][_index];    
    }
    


}




