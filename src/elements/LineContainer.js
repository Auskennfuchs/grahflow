import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Line from './Line'
import { mapObject } from '../util/util';

const StyledLineContainer = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

class LineContainer extends Component {

    clientRect = {
        x: 0, y: 0
    }

    componentDidMount = () => {
        this.clientRect = ReactDOM.findDOMNode(this).getBoundingClientRect()
    }

    calcCenter = (elem) => {
        const { bounds } = elem
        return {
            x: -this.clientRect.x + bounds.x + bounds.width / 2,
            y: -this.clientRect.y + bounds.y + bounds.height / 2
        }
    }

    drawLine = (fromId, toId, id, onClick = () => { }) => {
        const { connectors } = this.props
        const from = connectors[`${fromId}.connector`]
        const to = connectors[`${toId}.connector`]
        if (from && to) {
            const start = this.calcCenter(from)
            const end = this.calcCenter(to)
            return (
                <Line key={id} start={start} end={end} color="rgb(241,250,151)" onClick={() => onClick({ fromId, toId })} />
            )
        }
        return null
    }

    render() {
        const { connections, children, onLineClick, ...rest } = this.props
        return (
            <StyledLineContainer {...rest}>
                {mapObject(connections, (from,to) => (
                    this.drawLine(from, to, to, onLineClick)
                ))}
                {children}
            </StyledLineContainer>
        )
    }
}

const mapState = ({ connections, connectors }) => ({ connections, connectors })

export default connect(mapState)(LineContainer)