import React, { Component } from 'react'

export default class ExploreView extends Component {
  
  componentDidMount(){
    this.props.fetchEvents()
  }

  render() {
    return(
      <div>
          {this.props.events.map((ticketEvent,id)=> {
            return (
              <div key={id}>
                <label> {ticketEvent.addr} </label>
              </div>
            )})
          }
      </div>
    )
  }
}

