const initialState = {
  events: []
}

const exploreReducer = (state = initialState, action) => {
  if (action.type === 'EXPLORE_ADD_EVENT')
  {
    return Object.assign({}, state, {
      events: [].concat(state.events, action.payload)
    })
  }

  if (action.type === 'EXPLORE_CLEAR_EVENTS')
  {
    return Object.assign({}, state, {
      events: []
    })
  }

  return state
}

export default exploreReducer
