class Tetro {
  //tetris obj with tetromino types property
	constructor() {
		this.TETROMINOS = {
			0: { shape: [[0]], color: '0, 0, 0' },
            B: { shape: [["B"]], color: "255,255,255" },
            I: {
              shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]],
              color: '220,20,60',
            },
            J: { shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]], color: '178,34,34' },
            L: {
              shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']],
              color: '255,69,0',
            },
            O: { shape: [['O', 'O'], ['O', 'O']], color: '128,0,0' },
            S: { shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]], color: '255,112,147' },
            T: {
              shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]],
              color: '255,0,0',
            },
            Z: { shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]], color: '255,50,50' },
		};
  }
  
  //generates a random tetris piece
	randomTetromino() {
		const tetrominos = "IJLOSTZ";
		const randTetromino =
			tetrominos[Math.floor(Math.random() * tetrominos.length)];
		return this.TETROMINOS[randTetromino];
	}
}

module.exports.Tetro = Tetro;