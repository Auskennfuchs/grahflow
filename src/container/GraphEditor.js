import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import cloneDeep from 'lodash/cloneDeep'
import mapValues from 'lodash/mapValues'
import GridBackground from '../components/GridBackground'
import Draggable from '../components/Draggable'
import LineContainer from '../elements/LineContainer'
import { addNode, updateNode, deleteNode } from '../redux/actions/nodes'
import { setConnection, removeConnection, removeConnectionNode } from '../redux/actions/connection'
import { removeConnectors } from '../redux/actions/connectors'
import NodeTypeSelector from '../components/NodeTypeSelector'
import { onSelfClick, mapObject } from '../util/util'
import { NodeComponents } from '../nodes'
import SimpleInOut from '../nodes/SimpleInOut'
import FlowEngine from '../apis/FlowEngine'
import { setNodeTypes } from '../redux/actions/types'
import { setInputExpose, setOutputExpose, removeOutputExpose, removeInputExpose } from '../redux/actions/expose'

const EditorWrapper = styled.div`
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
`

const EditorContainer = styled.div`
    background-color: #202020;
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
        connection: { start: undefined, end: undefined },
        showAddDialog: false,
        addDialogPos: { x: 0, y: 0 },
        canvas: {
            x: 0,
            y: 0,
            zoom: 1.0,
        },
        dragCanvas: {
            x: 0,
            y: 0,
            isDragging: false,
        },
        compensation: {
            x:0,y:0,width:0,height:0
        }
    }

    editorCanvas = null

    componentDidMount = () => {
        window.addEventListener('mouseup', this.onClickCanvas)
        window.addEventListener('mouseup', this.onDragCanvasEnd)
        window.addEventListener('mousemove', this.onDragCanvas)
        document.body.addEventListener('keyup', this.onKeyPress)
        this.loadNodeTypes()
        this.centerCanvas()
        this.calcCompensation()
    } 

    componentWillMount = () => {
        window.removeEventListener('mouseup', this.onClickCanvas)
        window.removeEventListener('mousemove', this.onDragCanvas)
    }

    onSelectElement = (selected) => {
        this.setState({
            selected,
            showAddDialog: false,
        })
        return false
    }

    onClickCanvas = (e) => {
        this.setState({
            selected: undefined
        })
    }

    onShowTypeSelector = (e) => {
        const x = e.clientX
        const y = e.clientY
        const { showAddDialog } = this.state
        this.setState({
            showAddDialog: !showAddDialog,
            addDialogPos: { x, y }
        })
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

    loadNodeTypes = async () => {
        const types = await this.props.getNodeTypes();
        this.props.setNodeTypes(types)
    }

    updateNodePosition = (id, { x, y }) => {
        const { canvas } = this.state
        const selNode = this.findNode(id)
        const gridSize = 25
        if (selNode) {
            selNode.x = Math.round(x / gridSize) * gridSize - Math.round(canvas.x / gridSize) * gridSize
            selNode.y = Math.round(y / gridSize) * gridSize - Math.round(canvas.y / gridSize) * gridSize
        }
        return selNode
    }

    onConnectorMouseDown = (id) => {
        const { connection } = this.state
        if (id.includes(".input.")) {
            connection.start = id
        }
        if (id.includes(".output.")) {
            connection.end = id
        }
        if (!connection.start || !connection.end) {
            this.setState({ connection })
        } else {
            this.addConnection(connection)
            this.setState({ connection: {} })
        }
    }

    onAddNode = (type) => {
        const { addDialogPos } = this.state
        this.addNode(addDialogPos, type)
        this.setState({ showAddDialog: false })
    }

    onKeyPress = (e) => {
        const { selected } = this.state
        if (selected) {
            if (e.keyCode === 46) {
                this.deleteNode(selected)
            }
        }
    }

    onExpose = (id) => {
        if (id.includes(".input.")) {
            this.props.exposeInput({
                id, value: "", name: id
            })
        }
        if (id.includes(".output.")) {
            this.props.exposeOutput({
                id, value: "", name: id
            })
        }
    }

    onConnectionClick = ({ toId }) => {
        this.props.removeConnection(toId)

    }

    onZoom = (e) => {
        const { canvas } = this.state
        let { zoom } = canvas
        const direction = Math.sign(e.deltaY) * -1.0;
        zoom = Math.min(1.0, zoom + 0.1 * direction)
        zoom = Math.max(0.4, zoom)
        const dx = (e.screenX + canvas.x) * (zoom - canvas.zoom)
        const dy = (e.screenY + canvas.y) * (zoom - canvas.zoom)
        this.setState({
            canvas: {
                ...canvas,
                zoom,
                x: canvas.x - dx,
                y: canvas.y - dy,
            }
        }, () => { this.calcCompensation();this.forceUpdate(); })
    }

    onStartCanvasMove = (e) => {
        if (e.button === 1) {
            this.setState({
                dragCanvas: {
                    x: e.clientX,
                    y: e.clientY,
                    isDragging: true,
                }
            })
        }
    }

    onDragCanvas = (e) => {
        const { dragCanvas, canvas } = this.state
        if (!dragCanvas.isDragging) {
            return
        }
        const x = canvas.x + (e.clientX - dragCanvas.x) / canvas.zoom
        const y = canvas.y + (e.clientY - dragCanvas.y) / canvas.zoom
        this.setState({
            dragCanvas: {
                ...dragCanvas,
                x: e.clientX,
                y: e.clientY,
            },
            canvas: {
                ...canvas,
                x, y
            }
        })
    }

    onDragCanvasEnd = (e) => {
        const { dragCanvas } = this.state
        if (e.button === 1 && dragCanvas.isDragging) {
            this.setState({
                dragCanvas: {
                    ...dragCanvas,
                    isDragging: false,
                }
            })
        }
    }

    renderElement = (element) => {
        const { selected, canvas } = this.state
        const { id, x, y } = element
        const TagName = NodeComponents[element.type] || SimpleInOut
        return (
            <Draggable key={id} initialPos={{ x: x + canvas.x, y: y + canvas.y }} onDragMove={(e) => this.onDragMove(id, e)} onDragEnd={(e) => this.onDragEnd(id, e)} canvas={canvas} style={{
                zIndex: selected === id ? 10 : 0,
            }}>
                <TagName active={selected === id} id={id} onMouseDown={() => this.onSelectElement(id)} element={element}
                    onConnectorMouseDown={this.onConnectorMouseDown} onExpose={this.onExpose} />
            </Draggable>
        )
    }

    addNode = ({ x, y }, type) => {
        const typeTemplate = this.props.NodeTypes[this.props.NodeTypes.findIndex(n => n.type === type)]
        const { canvas } = this.state
        const { zoom } = canvas
        const node = ReactDOM.findDOMNode(this)
        const rect = node.getBoundingClientRect()
        if (typeTemplate) {
            const node = {
                id: uuid(),
                x: (x - rect.left) / zoom - canvas.x,
                y: (y - rect.top) / zoom - canvas.y,
                ...cloneDeep(typeTemplate)
            }
            this.props.addNode(node)
        }
    }

    findNode = (id) => {
        const { nodes } = this.props
        return nodes[id]
    }

    deleteNode = (id) => {
        const node = this.findNode(id)
        if (node) {
            this.props.deleteNode(node)
        }
    }

    addConnection = (connection) => {
        this.props.createConnection(connection.start, connection.end)
    }

    splitId = (id) => {
        const parts = id.split('.')
        return {
            node: parts[0],
            group: parts[1],
            connector: parts[2]
        }
    }

    centerCanvas = () => {
        const rect = this.editorCanvas.getBoundingClientRect()
        let minX = 9999999
        let maxX = -9999999
        let minY = 9999999
        let maxY = -9999999
        const { nodes } = this.props
        mapValues(nodes, n => {
            minX = Math.min(minX, n.x)
            maxX = Math.max(maxX, n.x)
            minY = Math.min(minY, n.y)
            maxY = Math.max(maxY, n.y)
        })
        minX -= 200
        maxX += 200
        minY -= 200
        maxY += 200
        const middleX = (rect.width - maxX - minX) / 2.0
        const middleY = (rect.height - maxY - minY) / 2.0
        this.setState({
            canvas: {
                ...this.state.canvas,
                x: middleX,
                y: middleY,
            }
        }, () => this.forceUpdate())
    }

    calcCompensation = () => {
        const {canvas} = this.state
        const elem = ReactDOM.findDOMNode(this)
        const compensation = { width: 0, height: 0, x: 0, y: 0 }
        if (elem) {
            const rect = elem.getBoundingClientRect()
            compensation.width = rect.width / canvas.zoom
            compensation.height = rect.height / canvas.zoom
            const ratio = rect.width / (rect.width * canvas.zoom)
            compensation.x = (rect.width - compensation.width) / 2 * ratio
            compensation.y = (rect.height - compensation.height) / 2 * ratio
        }
        this.setState({compensation})
    }

    render() {
        const { nodes } = this.props
        const { showAddDialog, addDialogPos, canvas,compensation } = this.state
        return (
            <EditorWrapper>
                <EditorContainer style={{ width: `${compensation.width}px`, height: `${compensation.height}px`, transform: `scale(${canvas.zoom}) translate(${compensation.x}px, ${compensation.y}px)` }} onMouseDown={this.onStartCanvasMove}>
                    <GridBackground style={{ backgroundPositionX: canvas.x, backgroundPositionY: canvas.y }} />
                    <EditorCanvas onClick={this.onClickCanvas} ref={(ref) => { this.editorCanvas = ref }} onWheel={this.onZoom}>
                        <LineContainer onClick={onSelfClick(this.onShowTypeSelector)} onLineClick={this.onConnectionClick} />
                        {mapObject(nodes, (node => this.renderElement(node)))}
                    </EditorCanvas>
                </EditorContainer>
                {showAddDialog &&
                    <NodeTypeSelector style={{ left: addDialogPos.x, top: addDialogPos.y }} onClick={this.onAddNode} />
                }
            </EditorWrapper>
        )
    }
}

const mapState = ({ nodes, types, exposes }) => ({ nodes, NodeTypes: types, exposes })

const mapDispatch = (dispatch) => ({
    addNode: (node) => dispatch(addNode(node)),
    updateNode: (node) => dispatch(updateNode(node)),
    deleteNode: (node) => {
        dispatch(removeConnectionNode(node))
        dispatch(removeConnectors(node))
        dispatch(deleteNode(node))
        dispatch(removeOutputExpose(node.id))
        dispatch(removeInputExpose(node.id))
    },
    createConnection: (from, to) => dispatch(setConnection(from, to)),
    removeConnection: (con) => dispatch(removeConnection(con)),
    getNodeTypes: () => FlowEngine.getTypes(),
    setNodeTypes: (types) => dispatch(setNodeTypes(types)),
    exposeInput: (prop) => dispatch(setInputExpose(prop)),
    exposeOutput: (prop) => dispatch(setOutputExpose(prop)),
})

export default connect(mapState, mapDispatch)(GraphEditor)