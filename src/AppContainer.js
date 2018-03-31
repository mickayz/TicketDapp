import { connect } from 'react-redux'
import App from './App'
import {getWeb3Action} from "./util/web3/getWeb3"

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.web3.account,
    contract: state.web3.mainInstance
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initialize: () => {
      dispatch(getWeb3Action())
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

 export default AppContainer
