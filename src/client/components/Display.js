import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';
import { Header } from 'semantic-ui-react';

const Display = ({ gameOver, text, id, bob }) => {
  return (<StyledDisplay gameOver={gameOver} id={id} bob={bob}>
            <Header>{text}</Header>
          </StyledDisplay>);
}

export default Display;
