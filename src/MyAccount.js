import React, { Component } from "react";
//import "./Home.css";
import EventTicketContract from '../build/contracts/EventTicketInterface.json'





class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      events: [],
      eventCount: 0,
      yourEventCount: 0
    }

    this.createNewEvent = this.createNewEvent.bind(this);
  }

  componentWillMount() {
    this.updateYourEventCount()
    this.updateTotalEventCount()
    this.displayAllEvents()
  }

  getEventInstanceFromAddress(address){
    const contract = require('truffle-contract')
    const eventTickets = contract(EventTicketContract)
    eventTickets.setProvider(this.props.web3.currentProvider)
    return eventTickets.at(address)
  }

  displayAllEvents(){
    this.setState({events: []});
    if (this.props.cryptoTicketsInstance !== null){
      this.props.cryptoTicketsInstance.eventCount().then((result)=>{
        for (var i = 0; i<result.c[0]; i++){
          this.props.cryptoTicketsInstance.events(i).then((result) => {
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
      let events = this.state.events
      events.push(description)
      this.setState({events: events})
    })
  }

  createNewEvent(){
    if (this.props.cryptoTicketsInstance !== null){
      this.props.cryptoTicketsInstance.createEventType1(
        "Tiesto",10,2,10000, {from: this.props.account})
    }
  }

  updateTotalEventCount(){
    if (this.props.cryptoTicketsInstance !== null){
      this.props.cryptoTicketsInstance.eventCount().then((result)=>{
        this.setState({eventCount: result.toNumber()})
      })
    }
  }

  updateYourEventCount(){
      console.log("HERE")
    if (this.props.cryptoTicketsInstance !== null){     
      this.props.cryptoTicketsInstance.getEventCountForCreator(this.props.account).catch(error =>{
        //This is likely because there is no array for the .length
        console.log(error)
      }).then((result)=>{
        if (result){
          console.log("HERE")
          this.setState({yourEventCount: result.toNumber()})
        }
      })
    }
  }

  render() {
    return (
      <div>
        <h1>Crypto Tickets!</h1>
        <p>You are: {this.props.account}</p>
        <p>You manage {this.state.yourEventCount}</p>
        <p>The total number of events is: {this.state.eventCount}</p>
        <button onClick={this.createNewEvent}>New Event</button>
        <div id="events"> 
          {this.state.events.map((show,i) => {
            return ( <p key={i}> {show} </p>)
          })}
        </div>
      </div>
    );
  }
}

export default Home