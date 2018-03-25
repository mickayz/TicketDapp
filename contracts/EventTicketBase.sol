pragma solidity ^0.4.2;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./EventTicketInterface.sol";

contract EventTicketBase is EventTicketInterface, ERC721Token{
 
    using SafeMath for uint256;

    address private parent;
    address private creator;
    uint256 public totalTickets;
    string public description;

    //mapping from ticket to price
    mapping(uint256=>uint256) public ticketPrice;
    
    // Escrow used to verify face value purchases only
    //mapping from payer to tokenID
    mapping(address=>uint256) public tokenEscrow;

    // Used since the default ticketID in the above mapping (0) maps to a ticket
    mapping(address=>bool) public escrowDepositted;
    

 
     function EventTicketBase(address _creator, string _description, uint256 _total) public {
        parent = msg.sender;
        creator = _creator;
        description = _description;
        totalTickets = _total;
    }

    modifier parentOnly(){
        require(msg.sender==parent);
        _;
    }
    
    modifier creatorOnly(){
        require(msg.sender==creator);
        _;
    }
    
    modifier canCreateNewTickets(uint256 _quantity){
        require(totalSupply().add(_quantity)<=totalTickets);
        _;
    }

    modifier escrowPaidForToken(address _to, uint256 _tokenId){
        require(escrowDepositted[_to] == true);
        require(tokenEscrow[_to] == _tokenId);
        _;
    }

    function mint(address _recipient, uint256 _quantity, uint256 _amountPaid) public parentOnly canCreateNewTickets(_quantity){
        uint256 paymentLeft = _amountPaid;
        for (uint256 i = 0; i<_quantity; i++){
            uint256 ticketId = totalSupply();
            // record ticket price
            ticketPrice[ticketId] = determineTicketPrice(ticketId);
            // subtract from payment, safemath will throw if the buyer runs about
            paymentLeft = paymentLeft.sub(ticketPrice[ticketId]);
            // create the ticket token
            _mint(_recipient,ticketId);
        }
    }
 
    function ticketsRemaining() public view returns(uint256){
        return totalTickets.sub(totalSupply());
    }
 
    function getCreator() public view returns(address){
        return creator;
    }
 
     // TODO to think about: how can we prevent malicious hosts from making fake events
    function setDescription(string _description) public creatorOnly{
        description = _description;
    }

 
 
     // Escrow service for transfers

    function payEscrow(uint256 _tokenId) payable public{
        require(msg.value == ticketPrice[_tokenId]);
        require(escrowDepositted[msg.sender] == false);
        tokenEscrow[msg.sender] = _tokenId;
        escrowDepositted[msg.sender] = true;
    }
    
    function withdrawEscrow() public{
        require(escrowDepositted[msg.sender] == true);
        escrowDepositted[msg.sender] = false;
        // TODO check for reentrance
        msg.sender.transfer(ticketPrice[tokenEscrow[msg.sender]]);
    }

    // ERC721 override

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) escrowPaidForToken(_to, _tokenId){
      super.transfer(_to, _tokenId);
      escrowDepositted[_to] = false;
      msg.sender.transfer(ticketPrice[_tokenId]);
    }

    function takeOwnership(uint256 _tokenId) public escrowPaidForToken(msg.sender, _tokenId){
      super.takeOwnership(_tokenId);
      escrowDepositted[msg.sender] = false;
      ownerOf(_tokenId).transfer(ticketPrice[_tokenId]);
    }

    
}