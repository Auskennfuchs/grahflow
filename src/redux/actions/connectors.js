export const SET_CONNECTOR = "SET_CONNECTOR"
export const REMOVE_CONNECTORS = "REMOVE_CONNECTORS"

export const setConnector = (connector) => ({
    type: SET_CONNECTOR,
    connector
})

export const removeConnectors = (node) => ({
    type: REMOVE_CONNECTORS,
    node
})