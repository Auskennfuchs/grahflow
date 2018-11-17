import React, { Component } from 'react'
import GraphNode from '../components/GraphNode'
import MultiplyType from '../nodetypes/MultiplyType'

export default class Multiply extends Component {
    
    static defaultProps = {
        onClick: () => { },
    }

    state = {
        typeDef: MultiplyType
    }

    render() {
        const { typeDef } = this.state
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} title={typeDef.name} {...rest} onClick={(e) => onClick(id)} />
        )
    }
}
