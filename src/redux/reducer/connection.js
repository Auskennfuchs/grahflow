import { SET_CONNECTION, REMOVE_CONNECTION } from "../actions/connection"
import { mapObject } from "../../util/util";

const initialState = []

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTION:
            return [
                ...state,
                { from: action.from, to: action.to },
            ]
        case REMOVE_CONNECTION: {
            let newState = [...state]
            mapObject(action.node.properties,(propList,key)=>{
                mapObject(propList,(_,pKey)=>{
                    const id = `${action.node.id}.${key}.${pKey}`
                    newState = newState.filter(c => c.from !== id && c.to !== id)
                })
            })
            return newState
        }

        default:
            return state
    }
}