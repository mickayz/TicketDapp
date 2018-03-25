import React, { Component } from 'react'
import CryptoTicketsContract from '../build/contracts/CryptoTickets.json'
import EventTicketContract from '../build/contracts/EventTicketInterface.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      cryptoTicketsInstance: null,
      account: null,
      events: [],
      eventCount: 0,
      yourEventCount: 0
    }

    this.createNewEvent = this.createNewEvent.bind(this);
    this.setFee = this.setFee.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const cryptoTickets = contract(CryptoTicketsContract)
    cryptoTickets.setProvider(this.state.web3.currentProvider)
    
    // Get accounts
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({account: accounts[0]})
      cryptoTickets.deployed().then((instance) => {
        this.setState({cryptoTicketsInstance : instance})


        //Watch for events
        // TODO calling at init??
        // reason is because its staying on the last block and triggering the event
        //var newEventEvent = cryptoTicketsInstance.NewEvent({} , {fromBlock:'lastest'})
        /*var newEventEvent = this.state.cryptoTicketsInstance.NewEvent()
        newEventEvent.watch((error, result)=> {
          if (!error){
            //var eventInstance = this.getEventInstanceFromAddress(result.args.addr)
            //this.displayEvent(eventInstance)
            //console.log(result)           
            //NOTE for now update all events
            this.displayAllEvents()
            this.updateTotalEventCount()
            

            
          } else {
            console.log("ERROR: "+error)
          }
          
        })*/

        this.updateYourEventCount()
        this.updateTotalEventCount()
        this.displayAllEvents()
      })
    })
  }

  getEventInstanceFromAddress(address){
    const contract = require('truffle-contract')
    const eventTickets = contract(EventTicketContract)
    eventTickets.setProvider(this.state.web3.currentProvider)
    return eventTickets.at(address)
  }

  displayAllEvents(){
    this.setState({events: []});
    if (this.state.cryptoTicketsInstance !== null){
      this.state.cryptoTicketsInstance.eventCount().then((result)=>{
        for (var i = 0; i<result.c[0]; i++){
          this.state.cryptoTicketsInstance.events(i).then((result) => {
            console.log(result)
            this.displayEvent(this.getEventInstanceFromAddress(result))
            
          })
        }
      })  
    }
  }

  displayEvent(eventInstance){
    let description = "{Description: "
    eventInstance.description().catch(error => {
      console.log(error)
    }).then((result1) =>{
      description += result1
      return eventInstance.totalTickets()
    }).catch(error => {
      console.log(error)
    }).then((result2) => {
      description += ", totalTickets: "+result2.toNumber() + "}"
      this.state.events.push(description)
      this.setState({events: this.state.events})
    })
  }

  createNewEvent(){
    if (this.state.cryptoTicketsInstance !== null){
      this.state.cryptoTicketsInstance.createEventType1(
        "Tiesto",10,2,10000, {from: this.state.account})
    }
  }

  updateTotalEventCount(){
    if (this.state.cryptoTicketsInstance !== null){
      this.state.cryptoTicketsInstance.eventCount().then((result)=>{
        this.setState({eventCount: result.toNumber()})
      })
    }
  }

  updateYourEventCount(){
    if (this.state.cryptoTicketsInstance !== null){      
      this.state.cryptoTicketsInstance.getEventCountForCreator(this.state.address).catch(error =>{
        //This is likely because there is no array for the .length
        //console.log(error)
      }).then((result)=>{
        if (result){
          console.log("HERE")
          this.setState({yourEventCount: result.toNumber()})
        }
      })
    }
  }



  setFee(){
    if (this.state.cryptoTicketsInstance !== null){
      // TODO gas limit error
      this.state.cryptoTicketsInstance.setFee(100, {from: this.state.account})
    }
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Crypto Tickets!</h1>
              <p>You are: {this.state.account}</p>
              <p>You manage {this.state.yourEventCount}</p>
              <p>The total number of events is: {this.state.eventCount}</p>
              <button onClick={this.createNewEvent}>New Event</button>
              <button onClick={this.setFee}>Set Fee</button>
              <div id="events"> 
                {this.state.events.map((show,i) => {
                  return ( <p key={i}> {show} </p>)
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
