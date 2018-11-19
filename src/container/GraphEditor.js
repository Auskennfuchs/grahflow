import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import uuid from 'uuid/v4'
import cloneDeep from 'lodash/cloneDeep'
import GridBackground from '../components/GridBackground'
import Draggable from '../components/Draggable'
import LineContainer from '../elements/LineContainer'
import { addNode, updateNode, deleteNode } from '../redux/actions/nodes'
import { setConnection, removeConnection } from '../redux/actions/connection'
import { removeConnectors } from '../redux/actions/connectors'
import NodeTypeSelector from '../components/NodeTypeSelector'
import { onSelfClick, mapObject } from '../util/util'
import NodeTypes from '../nodetypes'
import { NodeComponents } from '../nodes'
import SimpleInOut from '../nodes/SimpleInOut';

const EditorWrapper = styled.div`
    height: 100%;
    overflow: auto;
    width: 100%;
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

    updateNodePosition = (id, { x, y }) => {
        const selNode = this.findNode(id)
        if (selNode) {
            selNode.x = x//Math.floor(e.x / 25) * 25
            selNode.y = y//Math.floor(e.y / 25) * 25
        }
        return selNode
    }

    onConnectorMouseDown = (id) => {
        const { connection } = this.state
        if (id.includes(".input.")) {
            connection.end = id
        }
        if (id.includes(".output.")) {
            connection.start = id
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

    renderElement = (element) => {
        const { selected } = this.state
        const { id, x, y } = element
        const TagName = NodeComponents[element.type] || SimpleInOut
        return (
            <Draggable key={id} initialPos={{ x, y }} onDragMove={(e) => this.onDragMove(id, e)} onDragEnd={(e) => this.onDragEnd(id, e)} style={{
                zIndex: selected === id ? 10 : 0,
            }}>
                <TagName active={selected === id} id={id} onMouseDown={() => this.onSelectElement(id)} element={element} onConnectorMouseDown={this.onConnectorMouseDown} />
            </Draggable>
        )
    }

    addNode = ({ x, y }, type) => {
        const typeTemplate = NodeTypes[NodeTypes.findIndex(n => n.type === type)]
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
        const start = this.splitId(connection.start)
        const end = this.splitId(connection.end)

        const nodeStart = this.findNode(start.node)
        const nodeEnd = this.findNode(end.node)
        console.log(nodeStart.properties[start.group][start.connector])
        nodeStart.properties[start.group][start.connector].connections = [
            ...nodeStart.properties[start.group][start.connector].connections || [],
            connection.end
        ]
        nodeEnd.properties[end.group][end.connector].connections = [connection.start]
        this.props.updateNode(nodeStart)
        this.props.updateNode(nodeEnd)
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
                        <LineContainer onClick={onSelfClick(this.onShowTypeSelector)} />
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

const mapState = ({ nodes }) => ({ nodes })

const mapDispatch = (dispatch) => ({
    addNode: (node) => dispatch(addNode(node)),
    updateNode: (node) => dispatch(updateNode(node)),
    deleteNode: (node) => {
        dispatch(removeConnection(node))
        dispatch(removeConnectors(node))
        dispatch(deleteNode(node))
    },
    createConnection: (from, to) => dispatch(setConnection(from, to)),
})

export default connect(mapState, mapDispatch)(GraphEditor)