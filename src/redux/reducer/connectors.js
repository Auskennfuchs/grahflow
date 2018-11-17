import { SET_CONNECTOR } from "../actions/connectors"

const initialState = {}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTOR:
            return {
                ...state,
                [action.connector.id]: action.connector,
            }
        default:
            return state
    }
}