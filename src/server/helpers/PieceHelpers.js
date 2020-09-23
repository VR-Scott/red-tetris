const { randomTetromino } = require("../../client/helpers/tetrominos");
const { Tetro } = require("../models/Tetro");

//generate an array of random tetros for players - ensures all players get the same pieces
const generateShapes = () => {
    Tetro;
    let shapes = [];
    for (i =0; i < 50; i++){
        shapes.push(new Tetro().randomTetromino());
    }
	return shapes;
};
module.exports = generateShapes;