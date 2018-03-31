import React, { Component } from 'react'

export default class ErrorMessage extends Component {
  
  componentWillReceiveProps(nextProps){
    if (nextProps.notifications.length >0) {
      setTimeout(this.props.clear,5000)
    }
  }

  render() {
    return(
      <div>
          {this.props.notifications.map((notification,id)=> {
            return (
              <div key={id}>
                <label> {notification} </label>
                <button onClick={this.props.clear} >X</button>
              </div>
            )})
          }
      </div>
    )
  }
}

