import React, { Component } from 'react'

export default class CreateView extends Component {
  
  createNewEvent(){
    this.props.createEvent({eventType:0,description:"tiesto",total:100, max:2, price:(10**18)})
  }

  render() {
    return(
      <div>
        <button onClick={this.createNewEvent.bind(this)}> Create Test </button>
      </div>
    )
  }
}

