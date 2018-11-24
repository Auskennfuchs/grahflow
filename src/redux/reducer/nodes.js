import { ADD_NODE, UPDATE_NODE, DELETE_NODE } from "../actions/nodes"

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
            const { [action.node.id]: deleteNode, ...rest } = state
            return rest
        }
        default:
            break
    }
    return state
}