import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import FlowEngine from '../apis/FlowEngine'
import { mapObject } from '../util/util';
import { setOutputExpose } from '../redux/actions/expose';

const StyledContainer = styled.div`
    grid-area: header;
    width: 100%;
    height: 100%;
    background-color: #393939;
`

class MainHeader extends Component {

    onRun = async () => {
        const { nodes, exposes, connections } = this.props
        const graphNodes = cloneDeep(nodes)
        let inputValues = {}
        mapObject(exposes.input, (p => {
            inputValues = {
                ...inputValues,
                [p.name]: p.value
            }
        }))

        mapObject(connections, (to, from) => {
            const path = from.replace(".input.",".properties.input.")
            set(graphNodes, `${path}.connection`, to)
        })
        const result = await this.props.runGraph({
            inputValues,
            nodes: graphNodes,
            exposes,
        })
        mapObject(result, (value, name) => {
            mapObject(exposes.output, (o) => {
                if (o.name === name) {
                    this.props.updateOutputExpose({ ...o, value })
                }
            })
        })
    }

    render() {
        return (
            <StyledContainer>
                <button onClick={this.onRun}>Run</button>
            </StyledContainer>
        )
    }
}

const mapState = ({ nodes, exposes, connections }) => ({ nodes, exposes, connections })

const mapDispatch = (dispatch) => ({
    runGraph: (data) => FlowEngine.runGraph(data),
    updateOutputExpose: (expose) => dispatch(setOutputExpose(expose))
})

export default connect(mapState, mapDispatch)(MainHeader)