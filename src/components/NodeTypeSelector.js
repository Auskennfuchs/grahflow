import React, { Component } from 'react'
import styled from 'styled-components'
import NodeTypes from '../nodetypes'

const StyledContainer = styled.div`
    position: absolute;
`

const ListContainer = styled.ul`
    margin: 0;
    padding: 0.5em 0;
    list-style-type: none;
    font-size: 12px;
    background-color: #393939;
`

const ListItem = styled.li`
    display: block;
    padding: 0.5em;    
    color: #999;
    cursor: pointer;
    user-select: none;

    &:hover {
        color: #fff;
    }
`

export default class NodeTypeSelector extends Component {
    static defaultProps = {
        onClick: () => { }
    }

    render() {
        const { onClick, ...rest } = this.props
        return (
            <StyledContainer {...rest}>
                <ListContainer>
                    {NodeTypes.map(node => (
                        <ListItem key={node.type} onClick={() => onClick(node.type)}>{node.name}</ListItem>
                    ))}
                </ListContainer>
            </StyledContainer>
        )
    }
}
