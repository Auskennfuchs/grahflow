import React, { Component } from 'react'
import GraphNode from './GraphNode'
import FresnelEffectType from '../nodetypes/FresnelEffectType'
import PropertyContainer, { InputPropertyContainer, OutputPropertyContainer, PropertyElement, PropertyConnector } from './PropertyContainer'
import { mapObject } from '../util/util'

const propSize = (o) => Object.keys(o).length

const mapProperties = (PropContainer) => (
    ({ properties, rightAlign, connectorRef = () => { }, parentId }) => (
        <PropContainer>
            {mapObject(properties, ({ name, type }, id) => (
                <PropertyElement key={id}>
                    {!rightAlign && <PropertyConnector innerRef={(elem) => connectorRef(id, elem)} id={`${parentId}.${id}.connector`} />}
                    <span>{name}({type})</span>
                    {rightAlign && <PropertyConnector innerRef={(elem) => connectorRef(id, elem)} id={`${parentId}.${id}.connector`} />}
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

    static defaultProps = {
        onClick: () => { },
        connectorRef: () => { },
    }

    render() {
        const { typeDef } = this.state
        const { input, output } = typeDef.properties
        const { id, onClick, connectorRef, ...rest } = this.props
        return (
            <GraphNode id={id} title={typeDef.name} {...rest} onClick={(e) => { e.stopPropagation(); return onClick(id) }}>
                <PropertyContainer>
                    {input && propSize(input) > 0 &&
                        <InputProps properties={input} connectorRef={(conId, ref) => { connectorRef(id, `input.${conId}`, ref) }} parentId={`${id}.input`} />
                    }
                    {output && propSize(output) > 0 &&
                        <OutputProps properties={output} rightAlign connectorRef={(conId, ref) => { connectorRef(id, `output.${conId}`, ref) }} parentId={`${id}.output`} />
                    }
                </PropertyContainer>
            </GraphNode>
        )
    }
}
