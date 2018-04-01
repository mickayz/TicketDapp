export default function checkWeb3(web3store){
  if (typeof web3store.web3Instance === 'undefined' || web3store.web3Instance === null) {
    return 'Web3 is not initialized.'
  }
  else if (typeof web3store.mainInstance === 'undefined' || web3store.mainInstance === null) {
    return 'No connection to main contract'
  }
  else if (typeof web3store.account === 'undefined' || web3store.account === null) {
    return 'Account not Found'
  }
  return null
}