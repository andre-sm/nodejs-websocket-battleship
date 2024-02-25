import { BOARD_SIZE } from '../constants/ships';
import { Coordinate } from '../models/player-models';

export const getSurroundCoordinates = (shipCoordinates: Coordinate[]) => {
  try {
    const surroundCoordinates: Coordinate[] = [];

    shipCoordinates.forEach((coordinate) => {
      const { x, y } = coordinate;

      surroundCoordinates.push({ x: x - 1, y }, { x: x + 1, y });
      surroundCoordinates.push({ x, y: y - 1 }, { x, y: y + 1 });
      surroundCoordinates.push({ x: x - 1, y: y - 1 }, { x: x + 1, y: y + 1 });
      surroundCoordinates.push({ x: x - 1, y: y + 1 }, { x: x + 1, y: y - 1 });
    });

    const filteredCoords = surroundCoordinates.filter((coordinate) => coordinate.x >= 0
      && coordinate.y >= 0
      && coordinate.x < BOARD_SIZE
      && coordinate.y < BOARD_SIZE
      && !shipCoordinates.some((coord) => coordinate.x === coord.x && coordinate.y === coord.y));

    const uniqueStrings = new Set(filteredCoords.map((coord) => JSON.stringify(coord)));
    return Array.from(uniqueStrings).map(((str) => JSON.parse(str)));
  } catch (error) {
    throw new Error('Error while getting surround coordinates');
  }
};
