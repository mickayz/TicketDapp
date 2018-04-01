import { connect } from 'react-redux'
import ExploreView from './ExploreView.js'
import { fetchEvents } from "./ExploreActions.js"



const mapStateToProps = (state, ownProps) => {
  return {
    events: state.explore.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEvents: () => {
      dispatch(fetchEvents())
    }
  }
}

const ExploreContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreView)

export default ExploreContainer
