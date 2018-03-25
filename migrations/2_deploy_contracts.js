var CryptoTickets = artifacts.require("./CryptoTickets.sol")

module.exports = function(deployer){
    deployer.deploy(CryptoTickets, 100);
};