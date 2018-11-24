import { SET_CONNECTION, REMOVE_CONNECTION_NODE, REMOVE_CONNECTION } from "../actions/connection"
import { mapObject } from "../../util/util";

const initialState = {}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTION:
            const { from, to } = action
            return {
                ...state,
                [from]: to,
            }
        case REMOVE_CONNECTION_NODE: {
            let newState = { ...state }
            const { id } = action.node
            mapObject(newState, (to, from) => {
                if (to.startsWith(id) || from.startsWith(id)) {
                    delete newState[from]
                }
            })
            return newState
        }

        case REMOVE_CONNECTION: {
            const { [action.from]: deleteCon, ...rest } = state
            return rest
        }

        default:
            return state
    }
}