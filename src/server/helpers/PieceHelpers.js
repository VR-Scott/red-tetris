const { randomTetromino } = require("../../client/helpers/tetrominos");
const { Tetro } = require("../models/Tetro");

const generateShapes = () => {
    Tetro;
    let shapes = [];
    for (i =0; i < 1000; i++){
        shapes.push(new Tetro().randomTetromino());
    }
    return shapes;
};
module.exports = generateShapes;