import store from '../../../store'
import { raiseNotification } from "../../../ui/notifications/NotificationActions"


export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function updateUser(name) {
  let web3store = store.getState().web3
  // Double-check web3's status.
  if (typeof web3store.web3Instance === 'undefined' || web3store.web3Instance === null) {
    console.error('Web3 is not initialized.');
    return dispatch => { return null }
  }
  else if (typeof web3store.mainInstance === 'undefined' || web3store.mainInstance === null) {
    console.error('No connection to main contract');
    return dispatch => {return null }
  }
  else if (typeof web3store.account === 'undefined' || web3store.account === null) {
    console.error('Account not Found');
    return dispatch => {return null }
  }
  else{
    return function(dispatch) {
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
}
