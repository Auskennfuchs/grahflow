import { combineReducers } from 'redux'
import ConnectionReducer from './connection'
import ConnectorReducer from './connectors'
import NodesReducer from './nodes'
import TypesReducer from './types'

//import { USER_LOGGED_OUT } from './actions/login'

const appReducers = combineReducers({
    connections: ConnectionReducer,
    connectors: ConnectorReducer,
    nodes: NodesReducer,
    types: TypesReducer,
})

export default (state, action) => {
    /*   if (action.type === USER_LOGGED_OUT) {
           state = undefined
       }*/
    return appReducers(state, action)
}