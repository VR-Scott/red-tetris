import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';
import { Header } from 'semantic-ui-react';

const Display = ({ gameOver, text, id }) => {
  return (<StyledDisplay gameOver={gameOver} id={id}>
            <Header>{text}</Header>
          </StyledDisplay>);
}

export default Display;
