import { SET_NODE_TYPES } from '../actions/types'

const initialState = []

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_NODE_TYPES:
            return [...action.types]
        default:
            return state
    }
}