import { browserHistory } from 'react-router'
import store from '../../store'
import { raiseNotification } from "../notifications/NotificationActions"
import checkWeb3 from "../../util/web3/checkWeb3"

function addEvent(currentEvent) {
  return {
    type: "EXPLORE_ADD_EVENT",
    payload: currentEvent
  }
}

function clearEvents() {
  return dispatch => {
    return new Promise((resolve,reject) => {
      dispatch({
        type: "EXPLORE_CLEAR_EVENTS",
        payload: null
      })
      resolve(true)
    })

  }
}

export function fetchEvents(name) {
  let web3store = store.getState().web3
  return function(dispatch) {
    let checkStatus = checkWeb3(web3store)
    if (checkStatus){
      return dispatch(raiseNotification(checkStatus))
    }
    
    // Attempt to sign up user.
    dispatch(clearEvents())
    .then(()=>{
      return web3store.mainInstance.numEvents()
    })
    .then((result)=>{
      for (let i = 0; i< result.toNumber(); i++){
        web3store.mainInstance.ticketEvents(i)
        .then(result => {
          dispatch(addEvent({id: result[0], type: result[1], addr: result[2], creator: result[3]}))
        })
      }
    })
    .catch(function(result) {
      console.log(result)
    })
    
  }
}
