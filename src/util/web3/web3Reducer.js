const initialState = {
  web3Instance: null,
  account: null,
  mainInstance: null
}

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    return Object.assign({}, state, {
      web3Instance: action.payload.web3Instance
    })
  }
  else if (action.type === 'ACCOUNT_INITIALIZED')
  {
    return Object.assign({}, state, {
      account: action.payload.account
    })
  }
  else if (action.type === 'MAIN_CONTRACT_INITIALIZED')
  {
    return Object.assign({}, state, {
      mainInstance: action.payload.mainInstance
    })
  }

  return state
}

export default web3Reducer
