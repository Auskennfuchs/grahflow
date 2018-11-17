import React from 'react'
import styled from 'styled-components'

const StyledPath = styled.path`
    stroke-width:2px;
    stroke: ${({ color }) => color};
    fill: none

    &:hover {
        stroke-width: 4px;
        cursor: pointer;
    }
`

const Line = ({ start, end, color = "rgb(0,0,0)" }) => {
    const x1 = start.x
    const y1 = start.y
    const x4 = end.x
    const y4 = end.y

    const xs = x1 + 25
    const xe = x4 - 25

    return (
        <StyledPath d={`M${x1} ${y1} ${xs} ${y1} ${xe} ${y4} ${x4} ${y4}`} color={color} />
    )
}

export default Line