import { Ship } from '../models/user-models';

export const createGameBoard = (ships: Ship[]) => {
  const board = new Array(ships.length).fill('E').map(() => new Array(ships.length).fill('E'));

  const shipsCoords = ships.map((shipData) => {
    const coordinates = [];
    const isVertical = shipData.direction;
    let { x } = shipData.position;
    let { y } = shipData.position;
    coordinates.push({ x, y });

    for (let i = 1; i < shipData.length; i += 1) {
      if (isVertical) {
        coordinates.push({ x, y: y += 1 });
      } else {
        coordinates.push({ x: x += 1, y });
      }
    }

    coordinates.forEach((coordinate) => {
      board[coordinate.x][coordinate.y] = 'S';
    });

    return {
      ...shipData,
      coordinates,
      health: shipData.length,
    };
  });

  return {
    board,
    shipsCoords,
  };
};
