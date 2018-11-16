import React, { Component } from 'react'
import styled, { css } from 'styled-components'

const StyledWrapper = styled.div`
    position: absolute;
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
    background-color: #222222;
    border-radius: 3px;
    color: #C1C1C1;
    font-size: 12px;
    overflow: hidden;
`

const Title = styled.div`
    padding: 1em 1em;
    font-weight: lighter;
    font-size: 13px;
    background-color: #393939;
    margin-bottom: 2px;
`

export default class GraphNode extends Component {

    static defaultProps = {
        x: 0,
        y: 0,
    }

    state = {
        hover: false,
    }

    setHover = (hover) => {
        this.setState({ hover })
    }

    render() {
        const { active, x, y, title, children,...rest } = this.props
        const { hover } = this.state
        return (
            <StyledWrapper active={active} style={{ left: `${x * 50}px`, top: `${y * 50}px` }} hover={hover}
                onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)} {...rest}>
                <StyledContainer>
                    <Title>{title}</Title>
                    {children}
                </StyledContainer>
            </StyledWrapper>
        )
    }
}
