import { useState, useEffect, useCallback } from "react";

export const useGameStatus = (rowsCleared) => {
  const [rows, setRows] = useState(0);

  const increaseRows = useCallback(
    (rowsCleared,setRows) => {
      if (rowsCleared > 0) {
        setRows((prev) => prev + rowsCleared);
      }
    },
    []
  );

  useEffect(() => {
    increaseRows(rowsCleared, setRows);
  }, [increaseRows, rowsCleared]);

  return {rows, setRows};
};