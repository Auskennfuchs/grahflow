import React, { Component } from 'react'
import GraphNode from '../components/GraphNode'
import FresnelEffectType from '../nodetypes/FresnelEffectType'

export default class FresnelEffect extends Component {
    
    static defaultProps = {
        onClick: () => { },
    }

    state = {
        typeDef: FresnelEffectType
    }

    render() {
        const { typeDef } = this.state
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} title={typeDef.name} {...rest} onClick={(e) => onClick(id)} />
        )
    }
}
