import { DEFAULT_SHIPS, BOARD_SIZE } from '../constants/ships';
import { Coordinate, CustomShip } from '../models/player-models';
import { getSurroundCoordinates } from './get-surround-coordinates';

const getShipCoordinates = (length: number, x: number, y: number, isVertical: boolean) => {
  const shipCoordinates = [];
  shipCoordinates.push({ x, y });

  for (let i = 1; i < length; i += 1) {
    if (isVertical) {
      shipCoordinates.push({ x, y: (y += 1) });
    } else {
      shipCoordinates.push({ x: (x += 1), y });
    }
  }
  return shipCoordinates;
};

export const generateBotShips = (): CustomShip[] => {
  const board = new Array(BOARD_SIZE).fill('').map(() => new Array(BOARD_SIZE).fill(''));
  const ships: CustomShip[] = [...DEFAULT_SHIPS];

  const setCoordinatesToBoard = (coordinates: Coordinate[], type: string) => {
    coordinates.forEach((coord) => {
      board[coord.x][coord.y] = type;
    });
    return coordinates;
  };

  ships.forEach((ship) => {
    let allShipsAreArranged = false;

    while (!allShipsAreArranged) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      const isVertical = !!Math.floor(Math.random() * 2);
      if (!isVertical && x > BOARD_SIZE - ship.length) continue;
      if (isVertical && y > BOARD_SIZE - ship.length) continue;

      const shipCoordinates = getShipCoordinates(ship.length, x, y, isVertical);
      const areAllCoordinatesEmpty = shipCoordinates.every((coord) => board[coord.x][coord.y] === '');
      const surroundCoordinates = getSurroundCoordinates(shipCoordinates);
      const areAllSurroundCoordinatesEmpty = surroundCoordinates.every((coord) => board[coord.x][coord.y] === '');

      if (!areAllCoordinatesEmpty && !areAllSurroundCoordinatesEmpty) continue;

      setCoordinatesToBoard(shipCoordinates, 'ship');
      setCoordinatesToBoard(surroundCoordinates, '=');

      ship.coordinates = shipCoordinates;
      ship.direction = isVertical;
      ship.health = ship.length;
      allShipsAreArranged = true;
    }
  });

  return ships;
};
