import { AttackRequest } from '../models/game-play-models';
import {
  CustomWebSocket, GameBoardShipsRequest, GamePlayerData,
} from '../models/player-models';
import * as store from '../services/store';
import { broadcastToAll, broadcastToBothDiff, broadcastToBothTheSame } from '../utils/broadcast';
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

      broadcastToBothDiff('start_game', responseData);

      const activePlayer = store.getActivePlayer(gameId);
      const playersIds = playersShipData.map((player) => player.currentPlayerIndex);

      if (activePlayer) {
        broadcastToBothTheSame('turn', JSON.stringify({ currentPlayer: activePlayer }), playersIds);
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
    const playersIds = [indexPlayer, opponentPlayer.index];
    const { board, ships: enemyShips } = opponentPlayer;

    if (x === undefined && y === undefined) {
      const randomCoordinate = getRandomCoordinate(board);
      x = randomCoordinate.x;
      y = randomCoordinate.y;
    }

    if (board[x][y] === 'empty' || board[x][y] === 'miss') {
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

        const gameTurnData = JSON.stringify({ currentPlayer: indexPlayer });

        if (hitShip.health === 0) {
          const killAttackData = JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'killed' });
          broadcastToBothTheSame('attack', killAttackData, playersIds);
          broadcastToBothTheSame('turn', gameTurnData, playersIds);

          hitShip.coordinates.forEach((coord) => {
            store.changeBoardCellStatus(gameId, opponentPlayer.index, coord.x, coord.y, 'kill');
          });

          const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);

          surroundCoordinates.forEach((coord) => {
            store.changeBoardCellStatus(gameId, opponentPlayer.index, coord.x, coord.y, 'miss');

            const missAttackData = JSON.stringify({ position: coord, currentPlayer: indexPlayer, status: 'miss' });

            broadcastToBothTheSame('attack', missAttackData, playersIds);
            broadcastToBothTheSame('turn', gameTurnData, playersIds);
          });

          const areAllShipsKilled = store.checkShipsHealth(gameId, opponentPlayer.index);

          if (areAllShipsKilled) {
            store.addWinToTable(indexPlayer);

            const finishData = JSON.stringify({ winPlayer: indexPlayer });
            broadcastToBothTheSame('finish', finishData, playersIds);
            broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
          }
        } else {
          store.changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'shot');

          const shotAttackData = JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'shot' });
          broadcastToBothTheSame('attack', shotAttackData, playersIds);
          broadcastToBothTheSame('turn', gameTurnData, playersIds);
        }
      } else {
        store.changeBoardCellStatus(gameId, opponentPlayer.index, x, y, 'miss');

        const missAttackData = JSON.stringify({ position: { x, y }, currentPlayer: indexPlayer, status: 'miss' });
        broadcastToBothTheSame('attack', missAttackData, playersIds);
        broadcastToBothTheSame('turn', JSON.stringify({ currentPlayer: opponentPlayer.index }), playersIds);

        store.changeActivePlayer(gameId, indexPlayer);
      }
    } else {
      broadcastToBothTheSame('turn', JSON.stringify({ currentPlayer: indexPlayer }), playersIds);
    }
  } catch (error) {
    console.error('Error: Internal server error', error);
  }
};

export {
  handleAddShips,
  handleAttack,
};
