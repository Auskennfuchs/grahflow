export const ADD_NODE = "ADD_NODE"
export const UPDATE_NODE = "UPDATE_NODE"
export const DELETE_NODE = "DELETE_NODE"

export const addNode = (node) => ({
    type: ADD_NODE,
    node
})

export const updateNode = (node) => ({
    type: UPDATE_NODE,
    node
})

export const deleteNode = (id) => ({
    type: DELETE_NODE,
    id
})