import React, { useState, useEffect, useCallback } from "react";

import { createStage, checkCollision } from "../helpers/gameHelpers";
import { userSocket, socketOff, socketOn, socketEmit } from "../middleware/socket";

// Styled Component
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

// Custom Hooks
import { useInterval } from "../hooks/useInterval";
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useGameStatus } from "../hooks/useGameStatus";
import { movePlayer, dropPlayer, drop, playerRotation } from "./MovePlayer";
// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import { TETROMINOS } from "../helpers/tetrominos";

let newGame = {
	users: [],
	left: [],
	room: null,
};

let mainSocket = null;

const Tetris = (props) => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(null);
	const [host, setHost] = useState(false);
	const [shapes, setShapes] = useState(null);
	const [user, setUser] = useState(null);
	const [start, setStart] = useState(false);
	const [shapeTrack, setShapeTrack] = useState(0);
	const {
		player,
		updatePlayerPos,
		resetPlayer,
		playerRotate,
		playerFall,
		setPlayer,
		rotate,
	} = usePlayer(setShapeTrack, TETROMINOS);
	const { stage, setStage, rowsCleared, addRow } = useStage(
		player,
		resetPlayer,
		mainSocket,
		shapes,
		shapeTrack,
		setPlayer
	);
	const { rows, setRows } = useGameStatus(
		rowsCleared
	);
	const startGame = useCallback(
		(
			setStart,
			setStage,
			setDropTime,
			resetPlayer,
			setGameOver,
			newGame,
			setWinner,
			setRows,
		) => {
			setStart(true);
			setStage(createStage());
			setDropTime(1000);
			resetPlayer(shapes, shapeTrack, setPlayer);
			setGameOver(false);
			newGame.left = [...newGame.users];
			setWinner(null);
			setRows(0);
		},
		[resetPlayer, setRows, setStage, shapes, setPlayer]
	);

	useEffect(() => {
		if (shapes) {
			startGame(
				setStart,
				setStage,
				setDropTime,
				resetPlayer,
				setGameOver,
				newGame,
				setWinner,
				setRows,
			);
		}
	}, [shapes, startGame, resetPlayer, setRows, setStage]);
	useEffect(() => {
		if (gameOver) setShapeTrack(0);
	}, [gameOver, shapeTrack, setShapeTrack]);
	const connect = useCallback(
		async (
			userSocket,
			newGame,
			setHost,
			setUser,
			setShapes,
			setWinner,
			setGameOver,
			setDropTime,
			setStart
		) => {
			if (!mainSocket) {
				let test = props.room.split("[");
				newGame.room = test[0][0] === "#" ? test[0].substr(1) : test[0];
				mainSocket = await userSocket(props.room, props.ip);
				socketOff(mainSocket, "updateUsers")
				socketOff(mainSocket, "updateUsers");
				socketOff(mainSocket, "addRow");
				socketOff(mainSocket, "start_game");
				socketOff(mainSocket, "deadUser");
				socketOff(mainSocket, "setWinner");
				socketOn(mainSocket, "updateUsers", (t) => {
					newGame.users = t;
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						setHost(true);
					setUser(newGame.users.find((e) => e.id === mainSocket.id));
				});
				socketOn(mainSocket, "start_game", (r) => {
					socketEmit(mainSocket, "updatePlayer", stage);
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						socketEmit(mainSocket, "receive shapes", r);
				});
				socketOn(mainSocket, "receive shapes", (shapes1) => {
					setShapes(shapes1);
				});
				socketOn(mainSocket, "deadUser", (id) => {
					newGame.left.splice(
						newGame.left.findIndex((e) => e.id === id),
						1
					);
					if (newGame.left.length === 1) {
						setGameOver(true);
						setDropTime(null);
						socketEmit(mainSocket, "winner", newGame.left[0]);
					}
				});
				socketOn(mainSocket, "setWinner", (p_name) => {
					setStart(false);
					socketEmit(mainSocket, "updatePlayer", stage);
					setWinner(p_name);
				});
			}
		},
		[props.room, stage, props.ip]
	);

	const useMountEffect = (
		fun,
		userSocket,
		newGame,
		setHost,
		setUser,
		setShapes,
		setWinner,
		setGameOver,
		setDropTime,
		setStart
	) =>
		useEffect(() => {
			fun(
				userSocket,
				newGame,
				setHost,
				setUser,
				setShapes,
				setWinner,
				setGameOver,
				setDropTime,
				setStart
			);
		}, [fun, newGame, setDropTime, setGameOver, setHost, setShapes, setStart, setUser, setWinner, userSocket]);

	const callStartGame = (mainSocket, setStart, newGame) => {
		socketEmit(mainSocket,"start?", newGame.room);
		setStart(true);
	};

	const keyUp = ({ keyCode }, gameOver, setDropTime) => {
		if (!gameOver) {
			if (keyCode === 40) {
				setDropTime(1000);
			}
		}
	};

	const move = (
		{ keyCode },
		movePlayer,
		dropPlayer,
		setDropTime,
		drop,
		rows,
		player,
		stage,
		updatePlayerPos,
		setGameOver,
		mainSocket,
		start,
		setStart,
		playerRotation,
		playerRotate,
		gameOver,
		setPlayer
	) => {
		if (!gameOver) {
			if (keyCode === 32) {
				playerFall(stage, player, checkCollision, setPlayer);
			}
			if (keyCode === 37) {
				movePlayer(-1, updatePlayerPos, player, stage, setPlayer);
			} else if (keyCode === 39) {
				movePlayer(1, updatePlayerPos, player, stage, setPlayer);
			} else if (keyCode === 40) {
				dropPlayer(
					setDropTime,
					drop,
					rows,
					player,
					stage,
					updatePlayerPos,
					setGameOver,
					mainSocket,
					start,
					setStart,
					setPlayer
				);
			} else if (keyCode === 38) {
				playerRotation(
					stage,
					1,
					playerRotate,
					checkCollision,
					rotate,
					player,
					setPlayer
				);
			}
		}
	};

	useInterval(
		(mainSocket, addRow, updatePlayerPos) => {
			socketOn( mainSocket,
				"addRow",
				() => {
					addRow(stage, setStage);
					updatePlayerPos({ x: 0, y: 0, collided: false }, setPlayer);
				},
				mainSocket,
				addRow,
				updatePlayerPos
			);
			drop(
				rows,
				player,
				stage,
				setDropTime,
				updatePlayerPos,
				setGameOver,
				mainSocket,
				start,
				setStart,
				setPlayer
			);
		},
		mainSocket,
		addRow,
		updatePlayerPos,
		dropTime
	);
	useMountEffect(
		connect,
		userSocket,
		newGame,
		setHost,
		setUser,
		setShapes,
		setWinner,
		setGameOver,
		setDropTime,
		setStart
	);

	return (
		<StyledTetrisWrapper
			role="button"
			tabIndex="0"
			onKeyDown={(e) =>
				move(
					e,
					movePlayer,
					dropPlayer,
					setDropTime,
					drop,
					rows,
					player,
					stage,
					updatePlayerPos,
					setGameOver,
					mainSocket,
					start,
					setStart,
					playerRotation,
					playerRotate,
					gameOver,
					setPlayer
				)
			}
			onKeyUp={(e) => keyUp(e, gameOver, setDropTime)}
		>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{winner ? (
						<Display id="winnerDisplay" text={`Winner: ${winner}`} />
					) : (
						""
					)}
					{gameOver ? (
						<Display
							id="gameOverDisplay"
							gameOver={gameOver}
							text="Game Over"
						/>
					) : (
						<div id="test">
							{user ? (
								<Display id="nicknameDisplay" text={`Name: ${user.p_name}`} />
							) : (
								""
							)}
							<Display id="rowsDisplay" text={`Rows: ${rows}`} />
						</div>
					)}
					{start ? (
						""
					) : host ? (
						<StartButton
							callback={callStartGame}
							mainSocket={mainSocket}
							setStart={setStart}
							newGame={newGame}
						/>
					) : (
						<p>Waiting for host</p>
					)}
				</aside>
				{!gameOver ? (
					<div id="stageContainer">
						{newGame.left
							? newGame.users.map((value, index) => {
									if (
										value.arena &&
										value.id !== mainSocket.id &&
										newGame.left.find((e) => e.id === value.id)
									)
										return (
											<div key={index} style={{ padding: "0 10px" }}>
												<p>{value.p_name}</p>
												<Stage type={1} stage={value.arena} />
											</div>
										);
									return null;
							  })
							: ""}
					</div>
				) : (
					""
				)}
			</StyledTetris>
		</StyledTetrisWrapper>
	);
};

export default Tetris;