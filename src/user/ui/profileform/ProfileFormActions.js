import store from '../../../store'
import { raiseNotification } from "../../../ui/notifications/NotificationActions"
import checkWeb3 from "../../../util/web3/checkWeb3"


export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function updateUser(name) {
  let web3store = store.getState().web3

  return function(dispatch) {
    let checkStatus = checkWeb3(web3store)
    if (checkStatus){
      return dispatch(raiseNotification(checkStatus))
    }

    // Attempt to sign up user.
    web3store.mainInstance.usernames(web3store.account)
    .then((result)=>{
      if (!result){
        console.log(result)
        throw new Error("NotRegistered")
      }
      else{
        return web3store.mainInstance.setUsername(name, {from: web3store.account})
      }
    })
    .then(function(result) {
      return dispatch(userUpdated({"name": name}))
    })
    .then(function(result) {
      // There is an event being listened for

    })
    .catch(function(result) {
      // If error...
      if (result.message==="NotRegistered"){
        dispatch(raiseNotification('Error: User has not been registered.'))
      }
      else{
        console.log(result)
      }
    })
    
  }
}
