import { checkCollision } from "../helpers/gameHelpers";
import { socketEmit } from "../middleware/socket";

export const movePlayer = (dir, updatePlayerPos, player, stage, setPlayer) => {
  if (!checkCollision(player, stage, { x: dir, y: 0 })) {
    updatePlayerPos({ x: dir, y: 0 }, setPlayer);
  }
};

export const dropPlayer = (
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
) => {
  setDropTime(null);
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
};

export const drop = (
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
) => {
  // Increase level when player has cleared 10 rows
  if (rows > (level + 1) * 10) {
    setLevel((prev) => prev + 1);
    // Also increase the speed
    setDropTime(1000 / (level + 1) + 200);
  }
  if (!checkCollision(player, stage, { x: 0, y: 1 })) {
    updatePlayerPos({ x: 0, y: 1, collided: false }, setPlayer);
  } else {
    // Game Over
    if (player.pos.y < 1) {
      console.log("GAME OVER!");
      socketEmit(mainSocket, "lose", mainSocket.id);
      setGameOver(true);
      setDropTime(null);
      setStart(false);
    }
    updatePlayerPos({ x: 0, y: 0, collided: true }, setPlayer);
  }
};

export const playerRotation = (
  stage,
  dir,
  playerRotateFunc,
  checkCollision,
  rotate,
  player,
  setPlayer
) => {
  playerRotateFunc(stage, dir, checkCollision, rotate, player, setPlayer);
};