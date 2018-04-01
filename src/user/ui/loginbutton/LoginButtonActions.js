import { browserHistory } from 'react-router'
import store from '../../../store'
import { raiseNotification } from "../../../ui/notifications/NotificationActions"
import checkWeb3 from "../../../util/web3/checkWeb3"

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser(name) {
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
        return dispatch(userLoggedIn({"name": result}))
      }
    })
    .then(function(result) {
      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }
      return browserHistory.push('/dashboard')
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
