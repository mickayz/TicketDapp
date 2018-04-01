var CryptoTickets = artifacts.require("./CryptoTickets.sol")
var EventTicketType0Factory = artifacts.require("./EventTicketType0Factory.sol")

module.exports = function(deployer){
    var i;
    deployer.deploy(CryptoTickets, 100)
    .then(()=>{
        return CryptoTickets.deployed()
    })
    .then(instance =>{
        i = instance
        return deployer.deploy(EventTicketType0Factory)
    })
    .then(() => {
        return i.addFactory(EventTicketType0Factory.address)
    })
};



