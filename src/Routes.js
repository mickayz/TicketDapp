import React from "react"
import {Route, Switch} from "react-router-dom"
import MyAccount from "./MyAccount"
import Home from "./Home"
import NotFound from "./NotFound"
import App from './App'


export default () =>
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/MyAccount" exact render={(props) => {
            console.log(props)
            return (<MyAccount {...props} />)
        }} />
        <Route component={NotFound} />
    </Switch>