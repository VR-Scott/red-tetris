import { useState, useEffect } from "react";

import { createStage } from "../helpers/gameHelpers";
import { socketEmit } from "../middleware/socket";

export const useStage = (
  player,
  resetPlayer,
  mainSocket,
  shapes,
  shapeTrack,
  setPlayer
) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  const addRow = (stage, setStage) => {
    for (let i = 1; i < stage.length; i++) stage[i - 1] = [...stage[i]];
    stage[stage.length - 1] = new Array(stage[0].length).fill(["B", "test"]);
    setStage(stage);
  };
  useEffect(() => {
    let counter = 0;
    setRowsCleared(0);
    const sweepRows = (newStage, mainSocket) =>
      newStage.reduce((ack, row) => {
        if (row.findIndex((cell) => cell[0] === 0 || cell[0] === "B") === -1) {
          setRowsCleared((prev) => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          counter++;
          if (counter > 1) socketEmit(mainSocket, "clearRow");
          return ack;
        }
        ack.push(row);
        return ack;
      }, []);

    const updateStage = (
      prevStage,
      player,
      resetPlayer,
      sweepRows,
      mainSocket
    ) => {
      // first flush stage from the previous render
      const newStage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === "clear" ? [0, "clear"] : cell))
      );

      // then draw tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });
      // then check if collided
      if (player.collided) {
        resetPlayer(shapes, shapeTrack, setPlayer);
        let temp = sweepRows(newStage, mainSocket);
        socketEmit(mainSocket,"update_player", temp);
        return temp;
      }

      return newStage;
    };

    setStage((prev) =>
      updateStage(prev, player, resetPlayer, sweepRows, mainSocket)
    );
    // eslint-disable-next-line
  }, [player, resetPlayer, mainSocket, rowsCleared, shapeTrack, shapes]);

  return { stage, setStage, rowsCleared, addRow };
};