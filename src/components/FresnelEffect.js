import React, { Component } from 'react'
import GraphNode from './GraphNode'
import FresnelEffectType from '../nodetypes/FresnelEffectType'

export default class FresnelEffect extends Component {
    state = {
        typeDef: FresnelEffectType
    }

    static defaultProps = {
        onClick: () => { },
    }

    render() {
        const { typeDef } = this.state
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} title={typeDef.name} {...rest} onClick={(e) => { e.stopPropagation(); return onClick(id) }}/>
        )
    }
}
