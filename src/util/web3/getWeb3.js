import store from '../../store'
import CryptoTickets from '../../../build/contracts/CryptoTickets.json'
import Web3 from 'web3'
import { raiseNotification } from "../../ui/notifications/NotificationActions"


export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

function accountInitiliazed(results){
  return {
    type: "ACCOUNT_INITIALIZED",
    payload: results
  }
}

function mainContractInitialized(results){
  return {
    type: "MAIN_CONTRACT_INITIALIZED",
    payload: results
  }
}

export let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3Instance: web3
      }

      console.log('Injected web3 detected.');

      resolve(store.dispatch(web3Initialized(results)))
    } else {

      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

      web3 = new Web3(provider)

      results = {
        web3Instance: web3
      }

      console.log('No web3 instance injected, using Local web3.');

      resolve(store.dispatch(web3Initialized(results)))
    }
  })
})

export let getAccount = () => {
  let web3 = store.getState().web3.web3Instance
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
          let account = accounts[0]
          if (error || typeof account === 'undefined'){
            reject(Error('Could not get account info.  Is Metamask installed and unlocked?'))
          }
          let results = {account: account}
          resolve(store.dispatch(accountInitiliazed(results)))
      })
    })
  } else {
    console.error('Web3 is not initialized.')
  }
}

export let getMainContract = () => {
  let web3 = store.getState().web3.web3Instance
  if (typeof web3 !== 'undefined'){
    const contract = require('truffle-contract')
    const ticketsContract = contract(CryptoTickets)
    ticketsContract.setProvider(web3.currentProvider)
    return ticketsContract.deployed()
    .then(function(instance) {
      let results = {mainInstance: instance}
      return store.dispatch(mainContractInitialized(results))
    })
    .catch(error => {
      console.error(error)
      throw new Error("Failed to find main contract")      
    })
  } else {
    console.error('Web3 is not initialized.')
  }
}

export let getWeb3Action = () => {
  return function(dispatch) {
    // Initialize web3 and set in Redux.
    getWeb3
    .then(results => {
      console.log('Web3 initialized!')
      return getAccount()
    }).then(results => {
      console.log("Account Found!")
      return getMainContract()
    }).then(results => {
      console.log("Main Contract Instantiated!")
    }).catch((error) => {
      dispatch(raiseNotification("Error: "+error.message))
    })

  }
}
