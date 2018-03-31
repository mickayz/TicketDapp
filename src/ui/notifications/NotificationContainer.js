import { connect } from 'react-redux'
import Notification from './Notification.js'
import { clearNotifications } from "./NotificationActions.js"



const mapStateToProps = (state, ownProps) => {
  return {
    notification: state.notification.messages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clear: () => {
      dispatch(clearNotifications())
    }
  }
}

const NotificationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification)

export default NotificationContainer
