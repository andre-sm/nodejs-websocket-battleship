import { Coordinate } from '../models/player-models';

export const getRandomCoordinate = ((board: Array<Array<string>>) => {
  try {
    const emptyCells: Coordinate[] = [];
    const priorityCells: Coordinate[] = [];

    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board.length; j += 1) {
        if (board[i][j] === '') {
          emptyCells.push({ x: i, y: j });
        } else if (board[i][j] === 'shot') {
          if (i >= 1 && i < board.length && j >= 1 && j < board.length) {
            if (board[i - 1][j] === '') priorityCells.push({ x: i - 1, y: j });
            if (board[i][j - 1] === '') priorityCells.push({ x: i, y: j - 1 });
          }
          if (i >= 0 && i < board.length - 1 && j >= 0 && j < board.length - 1) {
            if (board[i + 1][j] === '') priorityCells.push({ x: i + 1, y: j });
            if (board[i][j + 1] === '') priorityCells.push({ x: i, y: j + 1 });
          }
        }
      }
    }

    if (priorityCells.length !== 0) {
      return priorityCells[Math.floor(Math.random() * priorityCells.length)];
    }

    if (emptyCells.length !== 0) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return { x: 0, y: 0 };
  } catch (error) {
    console.error('Error while getting random coordinates', error);
  }
});
