import { connect } from 'react-redux'
import CreateView from './CreateView.js'
import { createEvent } from "./CreateActions.js"



const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createEvent: (params) => {
      dispatch(createEvent(params))
    }
  }
}

const CreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateView)

export default CreateContainer
