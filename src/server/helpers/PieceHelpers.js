const { randomTetromino } = require("../../client/helpers/tetrominos");
const { Tetro } = require("../models/Tetro");

const generateShapes = () => {
    Tetro;
    let shapes = [];
    for (i =0; i < 50; i++){
        shapes.push(new Piece().randomTetromino());
    }
	return shapes;
};
module.exports = generateShapes;