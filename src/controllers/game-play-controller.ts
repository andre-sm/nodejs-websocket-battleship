import { AttackRequest } from '../models/game-play-models';
import { CustomWebSocket, GameBoardShipsRequest } from '../models/user-models';
import * as store from '../services/store';
import { broadcastToBoth } from '../utils/broadcast';
import { createGameBoard } from '../utils/create-game-board';

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
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleAddShips,
  handleAttack,
};
