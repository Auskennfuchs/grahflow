import React, { Component } from 'react'
import GraphNode from '../components/GraphNode'

export default class SimpleInOut extends Component {

    static defaultProps = {
        onClick: () => { },
    }

    render() {
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} {...rest} onClick={(e) => onClick(id, e)} />
        )
    }
}
