import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import cloneDeep from 'lodash/cloneDeep'
import GridBackground from '../components/GridBackground'
import FresnelEffect from '../components/FresnelEffect'
import Draggable from '../components/Draggable'
import LineContainer from '../elements/LineContainer'
import { addNode, updateNode, deleteNode } from '../redux/actions/nodes'
import fresnelTemplate from '../nodetypes/FresnelEffectType'
import { setConnection } from '../redux/actions/connection';

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

class GraphEditor extends Component {

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
        connectionStart: undefined
    }

    types = {
        fresnelEffect: FresnelEffect,
    }

    componentDidMount = () => {
        window.addEventListener('mouseup', this.onClickCanvas)
        document.body.addEventListener('keyup', this.onKeyPress)
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

    onClickCanvas = (e) => {
        this.setState({
            selected: undefined
        })
    }

    onAddNode = (e) => {
        const rect = e.target.getBoundingClientRect()
        const x = e.clientX - rect.x
        const y = e.clientY - rect.y
        this.addNode({ x, y })
    }

    onDragMove = (id, e) => {
        this.updateNodePosition(id, { x: e.x, y: e.y })
    }

    onDragEnd = (id, e) => {
        const selNode = this.updateNodePosition(id, { x: e.x, y: e.y })
        if (selNode) {
            this.props.updateNode(selNode)
        }
    }

    updateNodePosition = (id, { x, y }) => {
        const { nodes } = this.props
        const selNode = nodes[nodes.findIndex(n => n.id === id)]
        if (selNode) {
            selNode.x = x//Math.floor(e.x / 25) * 25
            selNode.y = y//Math.floor(e.y / 25) * 25
        }
        return selNode
    }

    onConnectorMouseDown = (id) => {
        const { connectionStart } = this.state
        if (!connectionStart) {
            this.setState({ connectionStart: id })
        } else {
            this.props.createConnection(connectionStart, id)
            this.setState({ connectionStart: undefined })
        }
    }

    renderElement = (element) => {
        const { selected } = this.state
        const { id, x, y } = element
        const TagName = this.types[element.type]
        return (
            <Draggable key={id} initialPos={{ x, y }} onDragMove={(e) => this.onDragMove(id, e)} onDragEnd={(e) => this.onDragEnd(id, e)}>
                <TagName active={selected === id} id={id} onMouseDown={() => this.onSelectElement(id)} element={element} onConnectorMouseDown={this.onConnectorMouseDown} />
            </Draggable>
        )
    }

    addNode = ({ x, y }) => {
        const node = {
            id: uuid(),
            x, y,
            ...cloneDeep(fresnelTemplate)
        }
        this.props.addNode(node)
    }

    onKeyPress = (e) => {
        const { selected } = this.state
        if (selected) {
            if (e.keyCode === 46) {
                this.props.deleteNode(selected)
            }
        }
    }

    render() {
        const { nodes } = this.props
        return (
            <EditorWrapper>
                <EditorContainer style={{ width: "3000px", height: "2000px" }} onClick={this.onAddNode}>
                    <GridBackground />
                    <EditorCanvas onClick={this.onClickCanvas}>
                        <LineContainer />
                        {nodes.map(node => this.renderElement(node))}
                    </EditorCanvas>
                </EditorContainer>
            </EditorWrapper>
        )
    }
}

const mapState = ({ nodes }) => ({ nodes })

const mapDispatch = (dispatch) => ({
    addNode: (node) => dispatch(addNode(node)),
    updateNode: (node) => dispatch(updateNode(node)),
    deleteNode: (id) => dispatch(deleteNode(id)),
    createConnection: (from, to) => dispatch(setConnection(from, to))
})

export default connect(mapState, mapDispatch)(GraphEditor)
//                            <rect x={6} y={55} width={150} height={150} style={{ fill: "blue", stroke: "pink", strokeWidth: 5, fillOpacity: 0.1, strokeOpacity: 0.9 }} />
