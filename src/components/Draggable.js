import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash/debounce'

export default class Draggable extends Component {

    static defaultProps = {
        initialPos: { x: 0, y: 0 },
        onDragMove: () => { },
        onDragEnd: () => { },
        ref: () => { },
    }

    state = {
        pos: this.props.initialPos,
        dragging: false,
        rel: null, // position relative to the cursor        
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state.dragging && !prevState.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && prevState.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
        if (prevProps.initialPos !== this.props.initialPos) {
            this.setState({
                pos: this.props.initialPos
            })
        }
    }

    onMouseDown = (e) => {
        // only left mouse button
        if (e.button !== 0) return
        var pos = {
            left: ReactDOM.findDOMNode(this).offsetLeft,
            top: ReactDOM.findDOMNode(this).offsetTop,
        }
        this.setState({
            dragging: true,
            rel: {
                x: e.pageX - pos.left,
                y: e.pageY - pos.top
            }
        })
        e.stopPropagation()
        e.preventDefault()
    }

    onMouseUp = (e) => {
        this.setState({ dragging: false })
        e.stopPropagation()
        e.preventDefault()
        this.props.onDragEnd(this.state.pos)
    }

    debouncedMouseMove = debounce((pos) => this.props.onDragMove(pos), 100)

    onMouseMove = (e) => {
        if (!this.state.dragging) return
        const pos = {
            x: e.pageX - this.state.rel.x,
            y: e.pageY - this.state.rel.y
        }
        this.setState({
            pos
        })
        e.stopPropagation()
        e.preventDefault()
//        this.debouncedMouseMove(pos)
    }

    render() {
        const { onMouseDown, onDragEnd, onDragMove, children, initialPos, style, ref, ...rest } = this.props
        return (
            <div style={{
                ...style,
                position: "absolute",
                left: this.state.pos.x + 'px',
                top: this.state.pos.y + 'px',
            }} {...rest} onMouseDown={this.onMouseDown} ref={ref}>
                {children}
            </div>
        )
    }
}
