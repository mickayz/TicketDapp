const initialState = {
  messages: []
}

const notificationReducer = (state = initialState, action) => {
  if (action.type === 'RAISE_NOTIFICATION')
  {
    return Object.assign({}, state, {
      messages: [].concat(state.messages, action.message)
    })
  }

  if (action.type === 'CLEAR_NOTIFICATIONS')
  {
    return Object.assign({}, state, {
      messages: []
    })
  }

  return state
}

export default notificationReducer
