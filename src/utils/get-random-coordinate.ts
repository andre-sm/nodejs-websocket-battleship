import { Coordinate } from '../models/player-models';

export const getRandomCoordinate = ((board: Array<Array<string>>) => {
  try {
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
    console.log(priorityCells.length, 'priorityCells.length');
    if (priorityCells.length !== 0) {
      return priorityCells[Math.floor(Math.random() * priorityCells.length)];
    }
    console.log(emptyCells.length, 'emptyCells.length');
    if (emptyCells.length !== 0) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  } catch (error) {
    console.error('Error while getting random coordinates', error);
  }
});
