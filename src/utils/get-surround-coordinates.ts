import { Coordinate } from '../models/player-models';

export const getSurroundCoordinates = (shipCoordinates: Coordinate[]) => {
  const surroundCoordinates: Coordinate[] = [];

  shipCoordinates.forEach((coordinate) => {
    const { x, y } = coordinate;

    surroundCoordinates.push({ x: x - 1, y }, { x: x + 1, y });
    surroundCoordinates.push({ x, y: y - 1 }, { x, y: y + 1 });
    surroundCoordinates.push({ x: x - 1, y: y - 1 }, { x: x + 1, y: y + 1 });
    surroundCoordinates.push({ x: x - 1, y: y + 1 }, { x: x + 1, y: y - 1 });
  });

  return surroundCoordinates.filter((coordinate) => coordinate.x >= 0
    && coordinate.y >= 0
    && coordinate.x <= 10
    && coordinate.y <= 10
    && !shipCoordinates.some((coord) => coordinate.x === coord.x && coordinate.y === coord.y));
};
