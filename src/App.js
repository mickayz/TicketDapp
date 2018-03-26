import React, { Component } from 'react'
import { Link } from "react-router-dom" //https://serverless-stack.com/chapters/create-containers.html
import { Nav, Navbar, NavItem } from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import CryptoTicketsContract from '../build/contracts/CryptoTickets.json'
import getWeb3 from './utils/getWeb3'

// For now do routes here so we can pass state
import {Route, Switch} from "react-router-dom"
import MyAccount from "./MyAccount"
import Home from "./Home"
import NotFound from "./NotFound"




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
      account: null
    }

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
    
    const contract = require('truffle-contract')
    const cryptoTickets = contract(CryptoTicketsContract)
    cryptoTickets.setProvider(this.state.web3.currentProvider)
    
    // Get accounts
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({account: accounts[0]})
      cryptoTickets.deployed().then((instance) => {
        this.setState({cryptoTicketsInstance : instance})
        console.log("SET")
      })
    })
  }




  render() {
    return (
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Crypto Tickets</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/myaccount">
                <NavItem > My Account </NavItem>
              </LinkContainer>
              <LinkContainer to="/about">
                <NavItem> About </NavItem>
              </LinkContainer>
              <LinkContainer to="/faq">
                <NavItem> FAQ </NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        
      <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/MyAccount" exact render={(props) => {
                    return (<MyAccount 
                      web3={this.state.web3}
                      account={this.state.account}
                      cryptoTicketsInstance={this.state.cryptoTicketsInstance}
                      {...props} />)
                }} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
