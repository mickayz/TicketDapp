import { browserHistory } from 'react-router'
import store from '../../store'
import { raiseNotification } from "../notifications/NotificationActions"
import checkWeb3 from "../../util/web3/checkWeb3"

export function createEvent(params) {
  let web3store = store.getState().web3
  return function(dispatch) {
    let checkStatus = checkWeb3(web3store)
    if (checkStatus){
      return dispatch(raiseNotification(checkStatus))
    }
    if (params.eventType !== 0){
      console.log(params)
      return dispatch(raiseNotification("Event Type Not Supported"))
    }
    let description = params.description
    let total = params.total
    let max = params.max
    let price = params.price

    web3store.mainInstance.createEventType0(description,total,max,price,{from:web3store.account})
    .then((result)=>{
      // Nothing, listen for event
      return dispatch(raiseNotification('Creating Event...'))
    })
    .catch(function(result) {
        console.log(result)
    })
    
  }
}
