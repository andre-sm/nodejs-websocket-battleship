import { DEFAULT_SHIPS, BOARD_SIZE } from '../constants/ships';
import { Coordinate, CustomShip } from '../models/player-models';
import { getSurroundCoordinates } from './get-surround-coordinates';

const board = new Array(BOARD_SIZE).fill('empty').map(() => new Array(BOARD_SIZE).fill('empty'));

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

const setCoordinatesToBoard = (coordinates: Coordinate[], type: string) => {
  coordinates.forEach((coord) => {
    if (board[coord.x][coord.y] !== 'empty') {
      return [];
    }
    board[coord.x][coord.y] = type;
  });
  return coordinates;
};

export const generateBotShips = (): CustomShip[] => {
  const ships: CustomShip[] = [...DEFAULT_SHIPS];

  ships.forEach((ship) => {
    let allShipsAreArranged = false;

    while (!allShipsAreArranged) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      const isVertical = !!Math.floor(Math.random() * 2);
      if (!isVertical && x > BOARD_SIZE - ship.length) continue;
      if (isVertical && y > BOARD_SIZE - ship.length) continue;

      const shipCoordinates = getShipCoordinates(ship.length, x, y, isVertical);
      const checkedCoordinates = setCoordinatesToBoard(shipCoordinates, 'ship');
      if (checkedCoordinates.length === 0) continue;

      const surroundCoordinates = getSurroundCoordinates(checkedCoordinates);
      const checkedSurroundCoordinates = setCoordinatesToBoard(surroundCoordinates, '');
      if (checkedSurroundCoordinates.length === 0) continue;

      ship.coordinates = shipCoordinates;
      allShipsAreArranged = true;
    }
  });

  return ships;
};
