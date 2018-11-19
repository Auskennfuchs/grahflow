import { ADD_NODE, UPDATE_NODE, DELETE_NODE } from "../actions/nodes"
import { mapObject } from "../../util/util"

const initialState = {}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case ADD_NODE:
            return {
                ...state,
                [action.node.id]: action.node
            }
        case UPDATE_NODE: {
            return {
                ...state,
                [action.node.id]: action.node
            }
        }
        case DELETE_NODE: {
            mapObject(state, (node) => {
                mapObject(node.properties, (propList) => {
                    mapObject(propList, (prop) => {
                        prop.connections = (prop.connections || []).filter(p => !p.includes(action.node.id))
                    })
                })
            })
            const { [action.node.id]: deleteNode, ...rest } = state
            return rest
        }
        default:
            break
    }
    return state
}