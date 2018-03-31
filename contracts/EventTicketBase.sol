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

    struct escrowPayment{
        uint256 ticketId;
        uint256 payment;
    }

    // mapping from ticket to price paid
    mapping(uint256=>uint256) public ticketPrice;
    
    // Escrow used to verify less than or equal to face value purchases only
    // mapping from payer to escrowPayment
    mapping(address=>escrowPayment) public tokenEscrow;


 
     function EventTicketBase(address _creator, string _description, uint256 _total) public 
        ERC721Token(_description, "CRYPTOTIX")
     {
        parent = msg.sender;
        creator = _creator;
        description = _description;
        totalTickets = _total;
    }

    // Autogenerated getters do not count for the interface :/
    //https://ethereum.stackexchange.com/questions/34267/this-contract-does-not-implement-all-functions-and-thus-cannot-be-created?rq=1
    function totalTickets() public view returns(uint256){
        return totalTickets;
    }
    function description() public view returns(string){
        return description;
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
        require(tokenEscrow[_to].ticketId == _tokenId);
        require(tokenEscrow[_to].payment > 0);
        require(tokenEscrow[_to].payment <= ticketPrice[_tokenId]);
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
        name_ = _description;
    }

 
 
     // Escrow service for transfers

    function payEscrow(uint256 _tokenId) payable public{
        require(msg.value <= ticketPrice[_tokenId]);
        require(tokenEscrow[msg.sender].payment == 0);
        tokenEscrow[msg.sender] = escrowPayment(_tokenId,msg.value);
    }
    
    function withdrawEscrow() public{
        uint256 previousPayment = tokenEscrow[msg.sender].payment;
        require(previousPayment > 0);
        tokenEscrow[msg.sender].payment = 0;
        msg.sender.transfer(previousPayment);
    }

    // ERC721 Override for escrow
    function transferFrom(address _from, address _to, uint256 _tokenId) public escrowPaidForToken(_to, _tokenId) {
        // Super still uses the  canTransfer modifier
        // https://ethereum.stackexchange.com/questions/21380/override-parent-method-and-modifiers
        super.transferFrom(_from,_to,_tokenId);
        uint256 escrowAmount = tokenEscrow[msg.sender].payment;
        tokenEscrow[msg.sender].payment = 0;
        _from.transfer(escrowAmount);
    }


    // DEPRECIATED ERC721 override

    /*
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
    */
    
    
}