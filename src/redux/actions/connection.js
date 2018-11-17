export const SET_CONNECTION = "SET_CONNECION"
export const REMOVE_CONNECTION = "REMOVE_CONNECION"

export const setConnection = (from,to) => ({
    type: SET_CONNECTION,
    from,to
})

export const removeConnection = (node) => ({
    type: REMOVE_CONNECTION,
    node
})