import { SET_INPUT_EXPOSE, SET_OUTPUT_EXPOSE, REMOVE_OUTPUT_EXPOSE, REMOVE_INPUT_EXPOSE } from '../actions/expose'
import { mapObject } from '../../util/util'

const initialState = {
    input: {},
    output: {}
}

const removeStarWith = (obj, str) => {
    mapObject(obj, (_, key) => {
        if (key.startsWith(str)) {
            delete obj[key]
        }
    })
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_INPUT_EXPOSE:
            return {
                ...state,
                input: {
                    ...state.input,
                    [action.property.id]: action.property
                }
            }
        case SET_OUTPUT_EXPOSE:
            return {
                ...state,
                output: {
                    ...state.output,
                    [action.property.id]: action.property
                }
            }
        case REMOVE_OUTPUT_EXPOSE:
            const { output } = state
            removeStarWith(output, action.id)
            return {
                ...state,
                output
            }
        case REMOVE_INPUT_EXPOSE:
            const { input } = state
            removeStarWith(input, action.id)
            return {
                ...state,
                input
            }
        default:
            return state
    }
}