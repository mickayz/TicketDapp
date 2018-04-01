import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import web3Reducer from './util/web3/web3Reducer'
import notificationReducer from './reducers/notificationReducer'
import exploreReducer from './reducers/exploreReducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  web3: web3Reducer,
  notification: notificationReducer,
  explore: exploreReducer
})

export default reducer
