import styled from 'styled-components'

const PropertyContainer = styled.div`
    display: flex;
    justify-content: space-between;
    
    & > * {
        margin-left: 1px;

        &:nth-child(1) {
            margin-left: 0;
        }
    }
`

const InOutPropertyContainer = styled.div`
    padding: 0.5em 0;
    flex: 0 1 auto;
`

export const InputPropertyContainer = styled(InOutPropertyContainer)`
    background-color: #393939;
    padding-right: 1em;
    text-align: left;
`
export const OutputPropertyContainer = styled(InOutPropertyContainer)`
    background-color: #2B2B2B;
    padding-left: 1em;
    text-align: right;
`

export const PropertyConnector = styled.div`
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: #212121;
    border: 2px solid #F1FA97;
    border-radius: 50%;
    margin: auto 0.5em;
    flex: 0 0 auto;
`

export const PropertyElement = styled.div`
    padding: 0.5em 0;
    display: flex;
`

export default PropertyContainer