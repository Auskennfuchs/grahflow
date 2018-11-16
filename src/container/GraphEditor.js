import React, { Component } from 'react'
import styled from 'styled-components'
import GridBackground from '../components/GridBackground'
import GraphNode from '../components/GraphNode'
import PropertyContainer, { InputPropertyContainer, OutputPropertyContainer } from '../components/PropertyContainer'
import FresnelEffect from '../components/FresnelEffect';

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
        selected: undefined
    }

    onSelectElement = (selected) => {
        console.log("click", selected)
        this.setState({
            selected
        })
        return false
    }

    onClickCanvas = () => {
        console.log("canvas")
        this.setState({
            selected: undefined
        })
    }

    render() {
        const { selected } = this.state
        return (
            <EditorWrapper>
                <EditorContainer style={{ width: "3000px", height: "2000px" }}>
                    <GridBackground />
                    <EditorCanvas onClick={this.onClickCanvas}>
                        <GraphNode active title="Multiply">
                            <PropertyContainer>
                                <InputPropertyContainer>
                                    Input
                                </InputPropertyContainer>
                                <OutputPropertyContainer>
                                    Output
                                </OutputPropertyContainer>
                            </PropertyContainer>
                        </GraphNode>
                        <FresnelEffect x={6} y={6} active={selected === 1} id={1} onClick={this.onSelectElement} />
                    </EditorCanvas>
                </EditorContainer>
            </EditorWrapper>
        )
    }
}
