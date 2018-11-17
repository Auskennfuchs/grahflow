import { SET_CONNECTOR, REMOVE_CONNECTORS } from "../actions/connectors"
import { mapObject } from "../../util/util";

const initialState = {}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTOR:
            return {
                ...state,
                [action.connector.id]: action.connector,
            }
        case REMOVE_CONNECTORS: {
            let newState = {...state}
            mapObject(action.node.properties,(propList,key)=>{
                mapObject(propList,(_,pKey)=>{
                    const id = `${action.node.id}.${key}.${pKey}.connector`
                    delete newState[id]
                })
            })
            return newState
        }            
        default:
            return state
    }
}