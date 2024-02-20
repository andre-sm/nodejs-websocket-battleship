import { AttackRequest } from '../models/game-play-models';
import {
  CustomWebSocket, GameBoardShipsRequest, GamePlayerData,
} from '../models/player-models';
import * as store from '../services/store';
import { broadcastToAll, broadcastToBoth } from '../utils/broadcast';
import { getRandomCoordinate } from '../utils/get-random-coordinate';
import { getShipCoordinates } from '../utils/get-ship-coordinates';
import { getSurroundCoordinates } from '../utils/get-surround-coordinates';

const handleAddShips = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { gameId, ships, indexPlayer }: GameBoardShipsRequest = JSON.parse(data);
    const shipsWithCoords = getShipCoordinates(ships);
    const board = new Array(10).fill('empty').map(() => new Array(10).fill('empty'));

    const playersShipData = store.addShipsToGameBoard(gameId, indexPlayer, shipsWithCoords, board);

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
    const requestData: AttackRequest = JSON.parse(data);

    const { gameId, indexPlayer } = requestData;
    let { x, y } = requestData;

    const activePlayerId = store.getActivePlayer(gameId);
    if (indexPlayer !== activePlayerId) {
      return;
    }

    const opponentPlayer = store.getOpponentPlayer(gameId, indexPlayer) as GamePlayerData;
    const enemyShips = opponentPlayer.ships;

    if (x === undefined && y === undefined) {
      const { board } = opponentPlayer;
      const randomCoordinate = getRandomCoordinate(board);
      x = randomCoordinate.x;
      y = randomCoordinate.y;
    }

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

        hitShip.coordinates.forEach((coord) => {
          store.changeBoardCellStatus(gameId, opponentPlayer.index, coord.x, coord.y, 'kill');
        });

        const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);

        surroundCoordinates.forEach((coord) => {
          store.changeBoardCellStatus(gameId, opponentPlayer.index, coord.x, coord.y, 'miss');

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
          store.addWinToTable(indexPlayer);

          const finishResponseData = [{ [indexPlayer]: JSON.stringify({ winPlayer: indexPlayer }) },
            { [opponentPlayer.index]: JSON.stringify({ winPlayer: indexPlayer }) }];
          broadcastToBoth('finish', finishResponseData);

          const updateWinnersResponse = {
            type: 'update_winners',
            data: JSON.stringify(store.getWinsTable()),
            id: 0,
          };

          broadcastToAll(JSON.stringify(updateWinnersResponse));
        }
      } else {
        store.changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'shot');

        const attackResponseData = [{
          [indexPlayer]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'shot' }),
        }, {
          [opponentPlayer.index]: JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'shot' }),
        }];
        broadcastToBoth('attack', attackResponseData);
        broadcastToBoth('turn', gameTurnResponseData);
      }
    } else {
      store.changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'miss');

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

    // console.log(opponentPlayer.board);
  } catch (error) {
    console.error('Error: Internal server error', error);
  }
};

export {
  handleAddShips,
  handleAttack,
};
