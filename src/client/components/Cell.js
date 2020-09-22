import React from 'react';
import { StyledCell } from './styles/StyledCell';
const Tetro = require('../../server/models/Tetro').Tetro

let new_tetro = new Tetro()

const Cell = ({ type }) => (
	<StyledCell type={type} color={new_tetro.TETROMINOS[type].color} />
);

export default React.memo(Cell);