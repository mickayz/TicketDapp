import React, { Component } from 'react'
import CreateContainer from "../ui/create/CreateContainer"

class Create extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Create an Event</h1>
            <p>Specify a description, the Type of Ticket Model, the price, and the number of total tickets to sell</p>
            <CreateContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Create
