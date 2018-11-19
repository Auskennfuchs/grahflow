import { SET_CONNECTION, REMOVE_CONNECTION } from "../actions/connection"
import { mapObject } from "../../util/util";

const initialState = {}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTION:
            const { from, to } = action
            return {
                ...state,
                [`${from}|${to}`]: { from, to },
            }
        case REMOVE_CONNECTION: {
            let newState = { ...state }
            mapObject(action.node.properties, (propList, key) => {
                mapObject(propList, (_, pKey) => {
                    const id = `${action.node.id}.${key}.${pKey}`
                    mapObject(newState,(_,key)=>{
                        if(key.includes(id)) {
                            delete newState[key]
                        }
                    })
                })
            })
            return newState
        }

        default:
            return state
    }
}