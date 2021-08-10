import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'Samim';
    src: url('../assets/fonts/Samim/Samim.eot');
    src: url('../assets/fonts/Samim/Samim.eot?#iefix') format('embedded-opentype'),
         url('../assets/fonts/Samim/Samim.woff') format('woff'),
         url('../assets/fonts/Samim/Samim.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

* {
    box-sizing:border-box;
    margin: 0;
    padding: 0;
}

&html {
  background-color: ${props => props.theme.BackGround} !important ;
}

&.rIcon {
    color : ${props => props.theme.GrayGray} !important;
    cursor: pointer;
}

&.aIcon {
    color : ${props => props.theme.BlackWhite} !important;
    cursor: pointer;
}

&.hIcon {
    color: ${props => props.theme.BlackGray} !important;
    cursor: pointer;
}

 /* ScrollBar */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

`;

export default GlobalStyle;