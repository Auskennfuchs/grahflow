import React, { Component } from 'react'
import GraphNode from '../components/GraphNode'

export default class FresnelEffect extends Component {
    
    static defaultProps = {
        onClick: () => { },
    }

    render() {
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} {...rest} onClick={(e) => onClick(id)} >
                <div>
                    Test
                </div>
            </GraphNode>
        )
    }
}
