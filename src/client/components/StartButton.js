import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from "@material-ui/core";

const StyledStartButton = styled.button`
  box-sizing: border-box;

  margin: 0 0 20px 0;
  padding: 20px;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  border: none;
  color: white;
  background: #333;
  font-family: Pixel, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

const StartButton = ({ callback, mainSocket, setStart, newGame}) => (
  <Button variant="contained"
id="startButton"
  onClick={() => callback(mainSocket, setStart, newGame, setStart)} fullWidth>

  <Typography>START GAME</Typography>
</Button>
);

export default StartButton;
