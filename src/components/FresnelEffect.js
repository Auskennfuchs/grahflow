import React, { Component } from 'react'
import GraphNode from './GraphNode'
import FresnelEffectType from '../nodetypes/FresnelEffectType'
import PropertyContainer, { InputPropertyContainer, OutputPropertyContainer, PropertyElement, PropertyConnector } from './PropertyContainer'

const propSize = (o) => Object.keys(o).length

const mapObject = (o, mapFunc) => Object.keys(o).map(key => mapFunc(o[key], key))

const mapProperties = (PropContainer) => (
    ({ properties }) => (
        <PropContainer>
            {mapObject(properties, ({ name, type }, id) => (
                <PropertyElement key={id}>
                    <PropertyConnector />
                    <span>{name}({type})</span>
                </PropertyElement>
            ))}
        </PropContainer>
    )
)

const InputProps = mapProperties(InputPropertyContainer)
const OutputProps = mapProperties(OutputPropertyContainer)

export default class FresnelEffect extends Component {
    state = {
        typeDef: FresnelEffectType
    }

    static defaultState = {
        onClick: () => { }
    }

    render() {
        const { typeDef } = this.state
        const { input, output } = typeDef.properties
        const { id, onClick, ...rest } = this.props
        return (
            <GraphNode title={typeDef.name} {...rest} onClick={(e) => { e.stopPropagation(); return onClick(id) }}>
                <PropertyContainer>
                    {input && propSize(input) > 0 &&
                        <InputProps properties={input} />
                    }
                    {output && propSize(output) > 0 &&
                        <OutputProps properties={output} />
                    }
                </PropertyContainer>
            </GraphNode>
        )
    }
}
