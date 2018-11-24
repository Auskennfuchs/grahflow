import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import cloneDeep from 'lodash/cloneDeep'
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
import { setInputExpose, setOutputExpose, removeOutputExpose, removeInputExpose } from '../redux/actions/expose';

const EditorWrapper = styled.div`
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
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
    }

    componentDidMount = () => {
        window.addEventListener('mouseup', this.onClickCanvas)
        document.body.addEventListener('keyup', this.onKeyPress)
        this.loadNodeTypes()
    }

    componentWillMount = () => {
        window.removeEventListener('mouseup', this.onClickCanvas)
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
        const rect = e.target.getBoundingClientRect()
        const x = e.clientX - rect.x
        const y = e.clientY - rect.y
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
        const selNode = this.findNode(id)
        const gridSize=25
        if (selNode) {
            selNode.x = Math.round(x / gridSize) * gridSize
            selNode.y = Math.round(y / gridSize) * gridSize
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

    renderElement = (element) => {
        const { selected } = this.state
        const { id, x, y } = element
        const TagName = NodeComponents[element.type] || SimpleInOut
        return (
            <Draggable key={id} initialPos={{ x, y }} onDragMove={(e) => this.onDragMove(id, e)} onDragEnd={(e) => this.onDragEnd(id, e)} style={{
                zIndex: selected === id ? 10 : 0,
            }}>
                <TagName active={selected === id} id={id} onMouseDown={() => this.onSelectElement(id)} element={element}
                    onConnectorMouseDown={this.onConnectorMouseDown} onExpose={this.onExpose} />
            </Draggable>
        )
    }

    addNode = ({ x, y }, type) => {
        const typeTemplate = this.props.NodeTypes[this.props.NodeTypes.findIndex(n => n.type === type)]
        if (typeTemplate) {
            const node = {
                id: uuid(),
                x, y,
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

    render() {
        const { nodes } = this.props
        const { showAddDialog, addDialogPos } = this.state
        return (
            <EditorWrapper>
                <EditorContainer style={{ width: "3000px", height: "2000px" }}>
                    <GridBackground />
                    <EditorCanvas onClick={this.onClickCanvas}>
                        <LineContainer onClick={onSelfClick(this.onShowTypeSelector)} onLineClick={this.onConnectionClick} />
                        {mapObject(nodes, (node => this.renderElement(node)))}
                    </EditorCanvas>
                    {showAddDialog &&
                        <NodeTypeSelector style={{ left: addDialogPos.x, top: addDialogPos.y }} onClick={this.onAddNode} />
                    }
                </EditorContainer>
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