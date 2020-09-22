import { useState, useCallback } from "react";

import { STAGE_WIDTH } from "../helpers/gameHelpers";

export const usePlayer = (setShapeTrack, TETROMINOS) => {
	const [player, setPlayer] = useState({
		pos: { x: 0, y: 0 },
		tetromino: TETROMINOS[0].shape,
		collided: false,
	});

	const rotate = (matrix, dir) => {
		// make rows become cols (transpose)
		const rotatedTetro = matrix.map((_, index) =>
			matrix.map((col) => col[index])
		);

		// reverse each row to get rotated matrix
		if (dir > 0) return rotatedTetro.map((row) => row.reverse());
		return rotatedTetro.reverse();
	};

	const playerFall = (stage, player, checkCollision, setPlayer) => {
		const clonedPlayer = JSON.parse(JSON.stringify(player));
		while (!checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
			clonedPlayer.pos.y++;
		}
		clonedPlayer.pos.y--;
		setPlayer(clonedPlayer);
	};

	const playerRotate = (
		stage,
		dir,
		checkCollision,
		rotate,
		player,
		setPlayer
	) => {
		const clonedPlayer = JSON.parse(JSON.stringify(player));
		clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

		const pos = clonedPlayer.pos.x;
		let offset = 1;
		while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
			clonedPlayer.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > clonedPlayer.tetromino[0].length) {
				rotate(clonedPlayer.tetromino, -dir);
				clonedPlayer.pos.x = pos;
				return;
			}
		}
		setPlayer(clonedPlayer);
	};

	const updatePlayerPos = ({ x, y, collided }, setPlayer) => {
		setPlayer((prev) => ({
			...prev,
			pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
			collided,
		}));
	};
	const resetPlayer = useCallback(
		(shapes, shapeTrack, setPlayer) => {
			setPlayer({
				pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
				tetromino: shapes[shapeTrack].shape,
				collided: false,
			});
			if (shapeTrack + 1 > shapes.length - 1) {
				setShapeTrack(0);
			} else {
				setShapeTrack(shapeTrack + 1);
			}
		},
		[setShapeTrack]
	);

	return {player, updatePlayerPos, resetPlayer, playerRotate, playerFall, setPlayer, rotate, };
};
