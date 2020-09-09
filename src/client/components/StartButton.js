import React from 'react';
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';

const StartButton = ({ callback, mainSocket, setStart, newGame}) => (
  <Button variant="contained"
id="startButton"
  onClick={() => callback(mainSocket, setStart, newGame, setStart)} fullWidth>

  <Header>START GAME</Header>
</Button>
);

export default StartButton;
