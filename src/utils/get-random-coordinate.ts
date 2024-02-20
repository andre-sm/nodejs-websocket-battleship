import { Coordinate } from '../models/user-models';

export const getRandomCoordinate = ((board: Array<Array<string>>) => {
  const emptyCells: Coordinate[] = [];
  const priorityCells: Coordinate[] = [];

  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      if (board[i][j] === 'empty') {
        emptyCells.push({ x: i, y: j });
      } else if (board[i][j] === 'shot') {
        if (board[i - 1][j] && board[i - 1][j] === 'empty') priorityCells.push({ x: i - 1, y: j });
        if (board[i + 1][j] && board[i + 1][j] === 'empty') priorityCells.push({ x: i + 1, y: j });
        if (board[i][j - 1] && board[i][j - 1] === 'empty') priorityCells.push({ x: i, y: j - 1 });
        if (board[i][j + 1] && board[i][j + 1] === 'empty') priorityCells.push({ x: i, y: j + 1 });
      }
    }
  }

  if (priorityCells.length !== 0) {
    return priorityCells[Math.floor(Math.random() * priorityCells.length)];
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
});
