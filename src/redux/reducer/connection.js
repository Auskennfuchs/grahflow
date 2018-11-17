import { SET_CONNECTION } from "../actions/connection"

const initialState = []

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CONNECTION:
            return [
                ...state,
                { from: action.from, to: action.to },
            ]
        default:
            return state
    }
}