import styled from 'styled-components'

const GridBackground = styled.div`
    background-color: transparent;
    background-image:       linear-gradient(0deg, 
                                rgba(255, 255, 255, .05) 0%, rgba(255, 255, 255, .05) 1%, 
                                transparent 2%, transparent 49%, 
                                rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .05) 51%, 
                                transparent 52%, transparent), 
                            linear-gradient(90deg, 
                                rgba(255, 255, 255, .05) 0%, rgba(255, 255, 255, .05) 1%, 
                                transparent 2%, transparent 49%, 
                                rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .05) 51%, 
                                transparent 52%, transparent);
    background-size:50px 50px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`

export default GridBackground