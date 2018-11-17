import { combineReducers } from 'redux'
import ConnectionReducer from './connection'
import ConnectorReducer from './connectors'

//import { USER_LOGGED_OUT } from './actions/login'

const appReducers = combineReducers({
    connections: ConnectionReducer,
    connectors: ConnectorReducer,
})

export default (state, action) => {
    /*   if (action.type === USER_LOGGED_OUT) {
           state = undefined
       }*/
    return appReducers(state, action)
}