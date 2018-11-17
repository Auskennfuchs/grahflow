import { ADD_NODE, UPDATE_NODE, DELETE_NODE } from "../actions/nodes"

const initialState = []

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case ADD_NODE:
            return [
                ...state,
                action.node,
            ]
        case UPDATE_NODE: {
            const idx = state.findIndex(n => n.id === action.node.id)
            if (idx !== -1) {
                const newState = [...state]
                newState.splice(idx, 1, action.node)
                return newState
            }
            break;
        }
        case DELETE_NODE: {
            const idx = state.findIndex(n => n.id === action.id)
            if (idx !== -1) {
                const newState = [...state]
                newState.splice(idx, 1)
                return newState
            }
            break;
        }
        default:
            break
    }
    return state
}