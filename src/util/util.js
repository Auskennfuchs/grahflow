import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export const mapObject = (o, mapFunc) => Object.keys(o).map(key => mapFunc(o[key], key))

export const getOffset = (el) => {
    let _x = 0
    let _y = 0
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft
        _y += el.offsetTop - el.scrollTop
        el = el.offsetParent
    }
    return { top: _y, left: _x }
}

export const SelfClickElem = (Elem) => (
    class extends Component {
        onClick = (e) => {
            const domNode = ReactDOM.findDOMNode(this)
            console.log(e.target)
            if (domNode === e.target) {
                e.persist()
                this.props.onClick(e)
            }
        }

        render() {
            const { onClick, ...rest } = this.props
            return (
                <Elem onClick={this.onClick} {...rest} />
            )
        }
    }
)

export const onSelfClick = (func) => (
    (e) => {
        if (e.target === e.currentTarget) {
            func(e)
        }
    }
)
