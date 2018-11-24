import React, { Component } from 'react'
import styled from 'styled-components'
import { mapObject } from '../util/util';

const StyledContainer = styled.div`
    background-color: #393939;
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 1em;
    overflow: auto;
    color: #eee;

    input {
        max-width: 100%;
    }
`

export default class ExposeParameterList extends Component {
    static defaultProps = {
        properties: {}
    }

    onChange = (e,prop) => {
        this.props.updateFunction({
            ...prop,
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { properties } = this.props
        return (
            <StyledContainer>
                {mapObject(properties, (prop) => (
                    <div key={prop.id}>
                        <span>{prop.id}</span>
                        <p>
                            <span>Name:</span>
                            <input type="text" name="name" value={prop.name} onChange={(e)=>this.onChange(e,prop)} />
                        </p>
                        <p>
                            <span>Value:</span>
                            <input type="text" name="value" value={prop.value} onChange={(e)=>this.onChange(e,prop)}/>
                        </p>
                    </div>
                ))}
            </StyledContainer>
        )
    }
}
