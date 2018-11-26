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
        const { canvas } = this.props
        const node = ReactDOM.findDOMNode(this)
        var pos = {
            left: node.offsetLeft,
            top: node.offsetTop,
        }
        this.setState({
            dragging: true,
            rel: {
                x: (e.pageX/canvas.zoom - pos.left) + canvas.x,
                y: (e.pageY/canvas.zoom - pos.top) + canvas.y,
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
        const { canvas } = this.props
        const pos = {
            x: (e.pageX/canvas.zoom - this.state.rel.x) + canvas.x,
            y: (e.pageY/canvas.zoom - this.state.rel.y) + canvas.y,
        }
        this.setState({
            pos
        })
        e.stopPropagation()
        e.preventDefault()
    }

    render() {
        const { onMouseDown, onDragEnd, onDragMove, children, initialPos, style, canvas, ref, ...rest } = this.props
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
