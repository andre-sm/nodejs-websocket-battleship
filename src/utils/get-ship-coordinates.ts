import { Ship } from '../models/user-models';

export const getShipCoordinates = (ships: Ship[]) => ships.map((shipData) => {
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

  return {
    ...shipData,
    coordinates,
    health: shipData.length,
  };
});
