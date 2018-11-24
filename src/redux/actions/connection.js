export const SET_CONNECTION = "SET_CONNECION"
export const REMOVE_CONNECTION_NODE = "REMOVE_CONNECION_NODE"
export const REMOVE_CONNECTION = "REMOVE_CONNECION"

export const setConnection = (from,to) => ({
    type: SET_CONNECTION,
    from,to
})

export const removeConnectionNode = (node) => ({
    type: REMOVE_CONNECTION_NODE,
    node
})

export const removeConnection = (from) => ({
    type: REMOVE_CONNECTION,
    from
})