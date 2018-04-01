import store from '../../../store'
import { raiseNotification } from "../../../ui/notifications/NotificationActions"
import checkWeb3 from "../../../util/web3/checkWeb3"


export function signUpUser(name) {
  let web3store = store.getState().web3
  return function(dispatch) {
    let checkStatus = checkWeb3(web3store)
    console.log(checkStatus)
    if (checkStatus){
      return dispatch(raiseNotification(checkStatus))
    }

    // Attempt to sign up user.
    web3store.mainInstance.usernames(web3store.account)
    .then((result)=>{
      if (result){
        console.log(result)
        throw new Error("exists")
      }
      else{
        return web3store.mainInstance.setUsername(name, {from: web3store.account})
      }
    })
    .then(function(result) {
      // There is an event being listened for
    })
    .catch(function(result) {
      // If error...
      if (result.message==="exists"){
        dispatch(raiseNotification('Error: Could not register. User already exists.'))
      }
      else{
        console.log(result)
      }
    })
  }
  
}
