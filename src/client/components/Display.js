import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';
import { Typography } from "@material-ui/core";

const Display = ({ gameOver, text, id }) => {
  return (<StyledDisplay gameOver={gameOver} id={id}>
            <Typography>{text}</Typography>
          </StyledDisplay>);
}

export default Display;
