import { createGlobalStyle } from 'styled-components';
import RobotoSlabRegular from '../assets/fonts/RobotoSlab-Regular.ttf';
import RobotoSlabSemiBold from '../assets/fonts/RobotoSlab-SemiBold.ttf';

export default createGlobalStyle`
  @font-face {
    font-family: 'Roboto Slab';
    src: url(${RobotoSlabRegular}) format("truetype");
    font-weight: 400;
  }
  @font-face {
    font-family: 'Roboto Slab';
    src: url(${RobotoSlabSemiBold}) format("truetype");
    font-weight: 600;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #191622;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 400;
  }

  button {
    cursor: pointer;
  }
`;
