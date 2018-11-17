import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import isEqual from 'lodash/isEqualWith'
import { connect } from 'react-redux'
import { setConnector } from '../redux/actions/connectors';

const PropertyContainer = styled.div`
    display: flex;
    justify-content: space-between;
    
    & > * {
        border-left: 1px solid #222;

        &:nth-child(1) {
            border-left: 0;
        }
    }
`

const InOutPropertyContainer = styled.div`
    padding: 0.5em 0;
    flex: 0 1 auto;
`

export const InputPropertyContainer = styled(InOutPropertyContainer)`
    background-color: rgba(57,57,57,0.9);
    padding-right: 1em;
    text-align: left;
`
export const OutputPropertyContainer = styled(InOutPropertyContainer)`
    background-color: rgba(43,43,43,0.9);
    padding-left: 1em;
    text-align: right;
`

const StyledPropertyConnector = styled.div`
    width: 10px;
    height: 10px;
    background-color: #212121;
    border: 1px solid #F1FA97;
    border-radius: 50%;
    position: relative;
    box-sizing:content-box;

    ${({ hover }) => hover ? css`&:after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border: 0 none;
        background-color: #F1FA97;
        border-radius: 50%;
        left: 2px;
        top: 2px;
    }` : ''}
`

const StyledPropertyConnectorWrapper = styled.div`
    display: inline-block;
    margin: auto 0;
    padding: 0 0.5em;
    flex: 0 0 auto;
`

class CPropertyConnector extends Component {
    state = {
        hover: false
    }

    bounds = {}

    setHover = (hover) => this.setState({ hover })

    getOffset = (el) => {
        let _x = 0
        let _y = 0
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft
            _y += el.offsetTop - el.scrollTop
            el = el.offsetParent
        }
        return { top: _y, left: _x }
    }

    measure = (ref) => {
        const clientRect = ref.getBoundingClientRect()
        const offset = this.getOffset(ref)
        return {
            ...offset,
            x: offset.left,
            y: offset.top,
            width: clientRect.width,
            height: clientRect.height,
        }
    }

    componentDidMount = () => {
        this.bounds = this.measure(this.ref)
        this.updateConnectorInStore(this.bounds)
    }

    componentDidUpdate = (prevProps, prevState) => {
        const bounds = this.measure(this.ref)
        const equal = isEqual(this.bounds, bounds)
        if (!equal) {
            this.bounds = bounds
            this.updateConnectorInStore(bounds)
        }
    }

    updateConnectorInStore = (bounds) => {
        const { setConnector, id } = this.props
        setConnector({ id, bounds })
    }

    render() {
        const { onMouseEnter, onMouseOut, innerRef, ...rest } = this.props
        const { hover } = this.state
        return (
            <StyledPropertyConnectorWrapper {...rest} onMouseEnter={() => this.setHover(true)} onMouseLeave={() => this.setHover(false)}>
                <StyledPropertyConnector hover={hover} ref={(ref) => { this.ref = ref }} />
            </StyledPropertyConnectorWrapper>
        )
    }
}

const mapProps = (dispatch) => ({
    setConnector: (data) => dispatch(setConnector(data))
})

export const PropertyConnector = connect(null, mapProps)(CPropertyConnector)

export const PropertyElement = styled.div`
    padding: 0.5em 0;
    display: flex;
`

export default PropertyContainer