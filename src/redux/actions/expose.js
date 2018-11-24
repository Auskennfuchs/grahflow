export const SET_OUTPUT_EXPOSE = "SET_OUTPUT_EXPOSE"
export const SET_INPUT_EXPOSE = "SET_INPUT_EXPOSE"

export const REMOVE_OUTPUT_EXPOSE = "REMOVE_OUTPUT_EXPOSE"
export const REMOVE_INPUT_EXPOSE = "REMOVE_INPUT_EXPOSE"

export const setOutputExpose = (property) => ({
    type: SET_OUTPUT_EXPOSE,
    property
})

export const setInputExpose = (property) => ({
    type: SET_INPUT_EXPOSE,
    property
})

export const removeOutputExpose = (id) => ({
    type: REMOVE_OUTPUT_EXPOSE,
    id
})

export const removeInputExpose = (id) => ({
    type: REMOVE_INPUT_EXPOSE,
    id
})