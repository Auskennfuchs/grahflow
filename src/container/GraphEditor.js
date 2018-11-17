import React, { Component } from 'react'
import styled from 'styled-components'
import GridBackground from '../components/GridBackground'
import FresnelEffect from '../components/FresnelEffect'
import Draggable from '../components/Draggable'
import LineContainer from '../elements/LineContainer'

const EditorWrapper = styled.div`
    height: 100%;
    overflow: auto;
    width: 100%;
`

const EditorContainer = styled.div`
    background-color: #202020;
    padding: 12px;
    width: 100%;
    min-width: 100%;
    position: relative;
    height: 100%;
    min-height: 100%;
`

const EditorCanvas = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`

export default class GraphEditor extends Component {

    state = {
        selected: undefined,
        elements: [
            {
                id: 1,
                type: "fresnelEffect",
                x: 0 * 50,
                y: 0 * 50,
                properties: {
                    input: {
                        normal: {
                            name: "Normal",
                            type: "Vector3",
                            default: { x: 0.0, y: 0.0, z: 0.0 },
                        },
                        viewDir: {
                            name: "View Dir",
                            type: "Vector3",
                            default: { x: 0.0, y: 0.0, z: 0.0 },
                        },
                        power: {
                            name: "Power",
                            type: "BigDecimal",
                            default: 1.0,
                        },
                    },
                    output: {
                        out: {
                            name: "Out",
                            type: "BigDecimal",
                            default: 0.0,
                        },
                    },
                }
            },
            {
                id: 2,
                type: "fresnelEffect",
                x: 15 * 50,
                y: 8 * 50,
                input: {
                    normal: {
                        name: "Normal",
                        type: "Vector3",
                        default: { x: 0.0, y: 0.0, z: 0.0 },
                    },
                    viewDir: {
                        name: "View Dir",
                        type: "Vector3",
                        default: { x: 0.0, y: 0.0, z: 0.0 },
                    },
                    power: {
                        name: "Power",
                        type: "BigDecimal",
                        default: 1.0,
                        connection: "1.output.out",
                    },
                },
                output: {
                    out: {
                        name: "Out",
                        type: "BigDecimal",
                        default: 0.0,
                    },
                },
            },
        ],
    }

    types = {
        fresnelEffect: FresnelEffect,
    }

    componentDidMount = () => {
        window.addEventListener('mouseup', this.onClickCanvas)
    }

    componentWillMount = () => {
        window.removeEventListener('mouseup', this.onClickCanvas)
    }

    onSelectElement = (selected) => {
        this.setState({
            selected
        })
        return false
    }

    onClickCanvas = () => {
        this.setState({
            selected: undefined
        })
    }

    onDragEnd = (id, e) => {
        const { elements } = this.state
        const selElement = elements[elements.findIndex(el => el.id === id)]
        if (selElement) {
            selElement.x = e.x//Math.floor(e.x / 25) * 25
            selElement.y = e.y//Math.floor(e.y / 25) * 25
            this.setState({
                elements
            })
        }
    }

    renderElement = (element) => {
        const { selected } = this.state
        const { id, x, y } = element
        const TagName = this.types[element.type]
        return (
            <Draggable key={id} initialPos={{ x, y }} onDragEnd={(e) => this.onDragEnd(id, e)}>
                <TagName active={selected === id} id={id} onMouseDown={() => this.onSelectElement(id)} />
            </Draggable>
        )
    }

    render() {
        const { elements } = this.state
        return (
            <EditorWrapper>
                <EditorContainer style={{ width: "3000px", height: "2000px" }}>
                    <GridBackground />
                    <EditorCanvas onClick={this.onClickCanvas}>
                        <LineContainer />
                        {elements.map(elem => this.renderElement(elem))}
                    </EditorCanvas>
                </EditorContainer>
            </EditorWrapper>
        )
    }
}


//                            <rect x={6} y={55} width={150} height={150} style={{ fill: "blue", stroke: "pink", strokeWidth: 5, fillOpacity: 0.1, strokeOpacity: 0.9 }} />
