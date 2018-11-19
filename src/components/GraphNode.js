import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropertyContainer, { PropertyElement, PropertyConnector, InputPropertyContainer, OutputPropertyContainer } from './PropertyContainer'
import { mapObject } from '../util/util'

const StyledWrapper = styled.div`
    padding: 2px;
    border-radius: 5px;
    border: 1px solid #191919;
    margin: -3px 0 0 -3px;
    cursor: normal;
    user-select: none;

    ${({ hover }) => hover ? css`
        border-color: #7C91F1;
        `
        : ''}

    ${({ active }) => active ? css`
        padding: 0;
        border-width: 3px;
        border-color: #7C91F1;
        `
        : ''}
`

const StyledContainer = styled.div`
    border-radius: 3px;
    color: #C1C1C1;
    font-size: 12px;
`

const Title = styled.div`
    padding: 1em 1em;
    font-weight: lighter;
    font-size: 13px;
    background-color: #393939;
    border-bottom: 2px solid #222;
`

const ChildContainer = styled.div`
    width: 100%;
    background-color: #191919;
`

const DefaultValueContainer = styled.div`
    position: absolute;
    background-color: #393939;
    left: -10px;
    top: 0;
    margin-top: 0.25em;
    padding: 0.25em 0.5em;
    transform: translateX(-100%);

    &::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 2px;
        right: -20px;
        top: 0;
        background-color: #f00;
        margin-top: 0.75em;    
    }
`

const propSize = (o) => Object.keys(o).length

const mapProperties = (PropContainer) => (
    ({ properties, rightAlign, connectorRef = () => { }, parentId, onConnectorMouseDown = () => { } }) => (
        <PropContainer>
            {mapObject(properties, ({ name, type, connections, ["default"]: defaultValue }, id) => (
                <PropertyElement key={id}>
                    {defaultValue !== undefined && (!connections || connections.length === 0) &&
                        <DefaultValueContainer>
                            {defaultValue}
                        </DefaultValueContainer>
                    }
                    {!rightAlign && <PropertyConnector innerRef={(elem) => connectorRef(id, elem)} id={`${parentId}.${id}.connector`} onMouseDown={() => onConnectorMouseDown(`${parentId}.${id}`)} connections={connections} />}
                    <span>{name}({type})</span>
                    {rightAlign && <PropertyConnector innerRef={(elem) => connectorRef(id, elem)} id={`${parentId}.${id}.connector`} onMouseDown={() => onConnectorMouseDown(`${parentId}.${id}`)} connections={connections} />}
                </PropertyElement>
            ))}
        </PropContainer>
    )
)

const InputProps = mapProperties(InputPropertyContainer)
const OutputProps = mapProperties(OutputPropertyContainer)

export default class GraphNode extends Component {

    static defaultProps = {
        onClick: () => { }
    }

    state = {
        hover: false,
    }

    setHover = (hover) => {
        this.setState({ hover })
    }

    onClick = (e) => {
        e.persist()
        e.stopPropagation()
        this.props.onClick(e)
    }

    render() {
        const { active, children, element, id, onClick, onConnectorMouseDown, onConnectorMouseUp, ...rest } = this.props
        const { hover } = this.state
        const { input, output } = element.properties
        return (
            <StyledWrapper active={active} hover={hover}
                onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)} onClick={this.onClick} {...rest}>
                <StyledContainer>
                    <Title>{element.name}</Title>
                    <PropertyContainer>
                        {input && propSize(input) > 0 &&
                            <InputProps properties={input} parentId={`${id}.input`} onConnectorMouseDown={onConnectorMouseDown} />
                        }
                        {output && propSize(output) > 0 &&
                            <OutputProps properties={output} rightAlign parentId={`${id}.output`} onConnectorMouseDown={onConnectorMouseDown} />
                        }
                    </PropertyContainer>
                    {children &&
                        <ChildContainer>
                            {children}
                        </ChildContainer>
                    }
                </StyledContainer>
            </StyledWrapper>
        )
    }
}
