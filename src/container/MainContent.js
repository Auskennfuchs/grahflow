import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import MainHeader from '../components/MainHeader'
import ExposeParameterList from '../components/ExposeParameterList'
import GraphEditor from './GraphEditor'
import { setInputExpose, setOutputExpose } from '../redux/actions/expose'

const StyledMainContent = styled.div`
  width: 100%;
  height: 100vh
  display: grid;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: 50px auto;
  grid-template-areas: "header header header"
                      ". . .";
`

class MainContent extends Component {
    render() {
        const {exposes} = this.props
        return (
            <StyledMainContent>
                <MainHeader />
                <ExposeParameterList properties={exposes.input} updateFunction={this.props.exposeInput}/>
                <GraphEditor />
                <ExposeParameterList properties={exposes.output} updateFunction={this.props.exposeOutput}/>
            </StyledMainContent>
        )
    }
}

const mapState =({exposes})=>({exposes})

const mapDispatch =(dispatch)=> ({
    exposeInput: (prop) => dispatch(setInputExpose(prop)),
    exposeOutput: (prop) => dispatch(setOutputExpose(prop)),
})

export default connect(mapState,mapDispatch)(MainContent)