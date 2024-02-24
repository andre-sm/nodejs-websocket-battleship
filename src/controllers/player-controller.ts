import { PlayerAuthData, CustomWebSocket } from '../models/player-models';
import { createId } from '../utils/create-id';
import * as store from '../services/store';
import { broadcastToAll, broadcastToBothTheSame } from '../utils/broadcast';

const handlePlayerAuth = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { name, password }: PlayerAuthData = JSON.parse(data);

    const id = createId();
    socket.playerId = id;
    socket.botInfo = {
      isSinglePlay: false,
      botId: null,
      gameId: null,
    };

    const isSuccessful = store.addPlayer(name, password, socket.playerId);

    const authResponseData = {
      index: socket.playerId,
      name,
      error: !isSuccessful,
      errorText: isSuccessful ? '' : 'Error: Player with provided name already exists',
    };

    const authResponse = {
      type: 'reg',
      data: JSON.stringify(authResponseData),
      id: 0,
    };

    socket.send(JSON.stringify(authResponse));

    if (isSuccessful) {
      broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
      broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
    }
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

const handleDisconnect = (socket: CustomWebSocket): void => {
  try {
    const { playerId } = socket;
    const gameWinnerId = store.clearGameData(playerId);

    if (gameWinnerId) {
      store.addWinToTable(gameWinnerId);

      const finishData = JSON.stringify({ winPlayer: gameWinnerId });
      broadcastToBothTheSame('finish', finishData, [gameWinnerId]);
      broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
    }
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handlePlayerAuth,
  handleDisconnect,
};
