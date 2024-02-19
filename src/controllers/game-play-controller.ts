import { AttackRequest } from '../models/game-play-models';
import { CustomWebSocket, GameBoardShipsRequest, GamePlayerData } from '../models/user-models';
import * as store from '../services/store';
import { broadcastToBoth } from '../utils/broadcast';
import { createGameBoard } from '../utils/create-game-board';
import { getSurroundCoordinates } from '../utils/get-surround-coordinates';

const handleAddShips = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { gameId, ships, indexPlayer }: GameBoardShipsRequest = JSON.parse(data);
    const { board, shipsCoords } = createGameBoard(ships);

    const playersShipData = store.addShipsToGameBoard(gameId, indexPlayer, shipsCoords, board);

    if (playersShipData) {
      const responseData = playersShipData.map((player) => ({
        [player.currentPlayerIndex]:
        JSON.stringify({ ships: player.ships, currentPlayerIndex: player.currentPlayerIndex }),
      }));

      broadcastToBoth('start_game', responseData);

      const activePlayer = store.getActivePlayer(gameId);
      if (activePlayer) {
        const gameTurnData = [{
          [activePlayer]: JSON.stringify({ currentPlayer: activePlayer }),
        }];

        broadcastToBoth('turn', gameTurnData);
      }
    }
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

const handleAttack = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const {
      gameId, x, y, indexPlayer,
    }: AttackRequest = JSON.parse(data);
    const opponentPlayer = store.getOpponentPlayer(gameId, indexPlayer) as GamePlayerData;
    const enemyShips = (opponentPlayer.ships);

    let hitShipIndex = -1;
    for (let i = 0; i < enemyShips.length; i += 1) {
      const ship = enemyShips[i];
      if (ship.coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y)) {
        hitShipIndex = i;
      }
    }

    if (hitShipIndex !== -1) {
      store.decreaseShipHealth(gameId, opponentPlayer.index, hitShipIndex);
      const hitShip = enemyShips[hitShipIndex];

      const gameTurnResponseData = [{
        [indexPlayer]: JSON.stringify({ currentPlayer: indexPlayer }),
      }, {
        [opponentPlayer.index]: JSON.stringify({ currentPlayer: indexPlayer }),
      }];

      if (hitShip.health === 0) {
        const attackResponseData = [{
          [indexPlayer]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'killed' }),
        }, {
          [opponentPlayer.index]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'killed' }),
        }];
        broadcastToBoth('attack', attackResponseData);
        broadcastToBoth('turn', gameTurnResponseData);

        const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);

        surroundCoordinates.forEach((coord) => {
          const responseData = [{
            [indexPlayer]: JSON.stringify({ position: coord, currentPlayer: indexPlayer, status: 'miss' }),
          }, {
            [opponentPlayer.index]: JSON.stringify({ position: coord, currentPlayer: indexPlayer, status: 'miss' }),
          }];
          broadcastToBoth('attack', responseData);
          broadcastToBoth('turn', gameTurnResponseData);
        });

        const areAllShipsKilled = store.checkShipsHealth(gameId, opponentPlayer.index);

        if (areAllShipsKilled) {
          const finishResponseData = [{ [indexPlayer]: JSON.stringify({ winPlayer: indexPlayer }) },
            { [opponentPlayer.index]: JSON.stringify({ winPlayer: indexPlayer }) }];
          broadcastToBoth('finish', finishResponseData);
        }
      } else {
        const attackResponseData = [{
          [indexPlayer]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'shot' }),
        }, {
          [opponentPlayer.index]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'shot' }),
        }];
        broadcastToBoth('attack', attackResponseData);
        broadcastToBoth('turn', gameTurnResponseData);
      }
    } else {
      const attackResponseData = [{
        [indexPlayer]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'miss' }),
      }, {
        [opponentPlayer.index]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'miss' }),
      }];
      broadcastToBoth('attack', attackResponseData);

      const gameTurnData = [{
        [opponentPlayer.index]: JSON.stringify({ currentPlayer: opponentPlayer.index }),
      }, {
        [indexPlayer]: JSON.stringify({ currentPlayer: opponentPlayer.index }),
      }];
      broadcastToBoth('turn', gameTurnData);

      store.changeActivePlayer(gameId, indexPlayer);
    }
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleAddShips,
  handleAttack,
};
