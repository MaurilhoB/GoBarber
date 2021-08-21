import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }
  body {
    background-color: #312e38;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
  body, input, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }
  strong, h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
  }
  button {
    cursor: pointer;;
  }
`

export default GlobalStyle
