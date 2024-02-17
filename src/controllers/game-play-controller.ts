import { CustomWebSocket, GameBoardShipsRequest } from '../models/user-models';
import * as store from '../services/store';
import { broadcastToBoth } from '../utils/broadcast-to-all';

const handleAddShips = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { gameId, ships, indexPlayer }: GameBoardShipsRequest = JSON.parse(data);
    const playersShipData = store.addShipsToGameBoard(gameId, indexPlayer, ships);

    if (playersShipData) {
      const responseData = playersShipData.map((player) => ({
        [player.currentPlayerIndex]: JSON.stringify({ ships: player.ships, currentPlayerIndex: player.currentPlayerIndex }),
      }));

      broadcastToBoth('start_game', responseData);
    }
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleAddShips,
};
