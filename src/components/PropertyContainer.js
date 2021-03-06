import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import isEqual from 'lodash/isEqualWith'
import { connect } from 'react-redux'
import { setConnector } from '../redux/actions/connectors';
import { getOffset, mapObject } from '../util/util';

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

    ${({ hover, connection }) => (hover || connection) ? css`&:after {
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

    static defaultProps = {
        onMouseEnter: () => { },
        onMouseLeave: () => { },
        onClick: () => { },
        onMouseDown: () => { },
        onMouseUp: () => { },
    }

    state = {
        hover: false,
    }

    bounds = {}

    setHover = (hover) => this.setState({ hover })

    measure = (ref) => {
        const clientRect = ref.getBoundingClientRect()
        const offset = getOffset(ref)
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

    onMouseEnter = (e) => {
        e.persist()
        this.setHover(true)
        this.props.onMouseEnter(e)
    }

    onMouseLeave = (e) => {
        e.persist()
        this.setHover(false)
        this.props.onMouseLeave(e)
    }

    onClick = (e) => {
        e.persist()
        e.stopPropagation()
        e.preventDefault()
        this.props.onClick(e)
    }

    onMouseDown = (e) => {
        e.persist()
        e.stopPropagation()
        e.preventDefault()
        this.props.onMouseDown(e)
    }

    onMouseUp = (e) => {
        e.persist()
        e.stopPropagation()
        e.preventDefault()
        this.props.onMouseUp(e)
    }

    updateConnectorInStore = (bounds) => {
        const { setConnector, id } = this.props
        setConnector({ id, bounds })
    }

    hasConnection = () => {
        const {connections,id} = this.props
        const propId = id.replace(".connector","")
        let isConnectedOutput = false
        mapObject(connections,(out)=>{
            if(out===propId) {
                isConnectedOutput=true
            }
        })
        return !!connections[propId] || isConnectedOutput
    }

    render() {
        const { onMouseEnter, onMouseOut, onMouseDown, onMouseUp, onClick, innerRef, ...rest } = this.props
        const { hover } = this.state
        const hasConnection = this.hasConnection()
        return (
            <StyledPropertyConnectorWrapper {...rest} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                <StyledPropertyConnector hover={hover} ref={(ref) => { this.ref = ref }} connection={hasConnection} />
            </StyledPropertyConnectorWrapper>
        )
    }
}

const mapDispatch = (dispatch) => ({
    setConnector: (data) => dispatch(setConnector(data))
})

const mapState = ({connections})=>({connections})

export const PropertyConnector = connect(mapState, mapDispatch)(CPropertyConnector)

export const PropertyElement = styled.div`
    padding: 0.5em 0;
    display: flex;
    position: relative;
`

export default PropertyContainer