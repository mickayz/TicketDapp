import React, { Component } from 'react'
import ExploreContainer from "../ui/explore/ExploreContainer"

class Explore extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Explore</h1>
            <p>Explore public events created selling tickets on TicketDapp!</p>
            <ExploreContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default Explore
