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

// new game obj
let newGame = {
	users: [],
	left: [],
	room: null,
};

// Will hold clientSide socket connection
let mainSocket = null;

const Tetris = (props) => {
	const [dropTime, setDropTime] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [bob, setBob] = useState(true)
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
	const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(
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
			setScore,
			setRows,
			setLevel
		) => {
			setStart(true);
			setStage(createStage());
			setDropTime(1000);
			resetPlayer(shapes, shapeTrack, setPlayer);
			setGameOver(false);
			newGame.left = [...newGame.users];
			setWinner(null);
			setScore(0);
			setRows(0);
			setLevel(1);
		},
		[resetPlayer, setLevel, setRows, setScore, setStage, shapes]
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
				setScore,
				setRows,
				setLevel
			);
		}
	}, [shapes, startGame]);
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
				// if a room and name are passed in the url the string props.room consists of that. i.e. '#room2[myName]'
				let test = props.room.split("[");
				// test now consists of array with the room and name separated. i.e. ['#room2', '\myName\']
				newGame.room = test[0][0] === "#" ? test[0].substr(1) : test[0];
				// newGame.room now contains room's name without the #
				// userSocket takes the props room and ip.
				// ip is a string of the ip address used to connect to the computer that is hosting.
				// if local then localhost but if hosting over LAN then the computer's LAN IP address
				mainSocket = await userSocket(props.room, props.ip);
				// userSocket returns the socket connection to the server.
				socketOff(mainSocket, "update_users");
				socketOff(mainSocket, "penalty_row");
				socketOff(mainSocket, "start_game");
				socketOff(mainSocket, "dc_player");
				socketOff(mainSocket, "set_player_winner");
				//set first user at index 0 to be host
				socketOn(mainSocket, "update_users", (t) => {
					newGame.users = t;
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						setHost(true);
					setUser(newGame.users.find((e) => e.id === mainSocket.id));
				});
				
				// when it receives "start_game" message it send out a message to update this player and
				// if it is host sends out message to room with the shapes.
				socketOn(mainSocket, "start_game", (r) => {
					socketEmit(mainSocket, "update_player", stage);
					if (newGame.users[0] && newGame.users[0].id === mainSocket.id)
						socketEmit(mainSocket, "create_tetrominos", r);
				});
				// when receives message "create_tetrominos shapes" it sets it's shapes to the shapes received.
				socketOn(mainSocket, "create_tetrominos", (shapes1) => {
					setShapes(shapes1);
				});

				// when receives "dc_player" it removes that user from the list of players left.
				socketOn(mainSocket, "dc_player", (id) => {
					newGame.left.splice(
						newGame.left.findIndex((e) => e.id === id),
						1
					);
					// if only one player left that player is the winner.
					if (newGame.left.length === 1) {
						setGameOver(true);
						setDropTime(null);
						socketEmit(mainSocket, "winner", newGame.left[0]);
					}
				});
				// sets winner display to the correct name.
				socketOn(mainSocket, "set_player_winner", (p_name) => {
					setStart(false);
					socketEmit(mainSocket, "update_player", stage);
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
		}, []);

		// declaring the function that will emit the start message to all the players
	const callStartGame = (mainSocket, setStart, newGame) => {
		socketEmit(mainSocket,"start?", newGame.room);
		setStart(true);
	};

	// when release the down button the drop speed returns to normal
	const keyUp = ({ keyCode }, gameOver, setDropTime, level) => {
		if (!gameOver) {
			if (keyCode === 40) {
				// setDropTime(1000 / (level + 1) + 200);
				setDropTime(1000);
			}
		}
	};

	// checks if an arrow key or spacebar is pressed and does the corresponding action 
	const move = (
		{ key },
		movePlayer,
		dropPlayer,
		setDropTime,
		drop,
		rows,
		level,
		player,
		stage,
		setLevel,
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
			switch(key) {
				case " ":
					playerFall(stage, player, checkCollision, setPlayer);
					break;
				case "ArrowLeft":
					movePlayer(-1, updatePlayerPos, player, stage, setPlayer);
					break;
				case "ArrowRight":
					movePlayer(1, updatePlayerPos, player, stage, setPlayer);
					break;
				case "ArrowDown":
					dropPlayer(
						setDropTime,
						drop,
						rows,
						level,
						player,
						stage,
						setLevel,
						updatePlayerPos,
						setGameOver,
						mainSocket,
						start,
						setStart,
						setPlayer
					);
					break;
				case "ArrowUp":
					playerRotation(
						stage,
						1,
						playerRotate,
						checkCollision,
						rotate,
						player,
						setPlayer
					);
					break;
				default:
			}

		}
	};

	useInterval(
		(mainSocket, addRow, updatePlayerPos) => {
			socketOn( mainSocket,
				"penalty_row",
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
				level,
				player,
				stage,
				setLevel,
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
					level,
					player,
					stage,
					setLevel,
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
			onKeyUp={(e) => keyUp(e, gameOver, setDropTime, level)}
		>
			<StyledTetris>
				<Stage stage={stage} />
				<aside>
					{winner ? winner.includes("Bobbers") ? (
						<div>
							<Display id="winnerDisplay" text={`Winner: ${winner}`} />
							<Display id="bobDisplay" bob={bob} text={`Bobbers is the greatest!`} />
						</div>
					) :  (
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
							<Display id="scoreDisplay" text={`Score: ${score}`} />
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