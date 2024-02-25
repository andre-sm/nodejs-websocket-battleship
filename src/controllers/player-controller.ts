import { PlayerAuthData, CustomWebSocket } from '../models/player-models';
import { createId } from '../utils/create-id';
import * as store from '../services/store';
import { broadcastToAll, broadcastToBothTheSame, disconnectPlayer } from '../utils/broadcast';

const handlePlayerAuth = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { name, password }: PlayerAuthData = JSON.parse(data);

    const existingPlayer = store.checkPlayerForExistence(name, password);
    let authResponseData;
    let isSuccessful;

    if (existingPlayer) {
      authResponseData = {
        index: existingPlayer.id,
        name,
        error: false,
        errorText: '',
      };

      disconnectPlayer(existingPlayer.id);
      socket.playerId = existingPlayer.id;
      socket.botInfo = {
        isSinglePlay: false,
        botId: null,
        gameId: null,
      };

      broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
      broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
    } else {
      const id = createId();
      socket.playerId = id;
      socket.botInfo = {
        isSinglePlay: false,
        botId: null,
        gameId: null,
      };

      const addPlayerResult = store.addPlayer(name, password, id);
      const { message } = addPlayerResult;
      isSuccessful = addPlayerResult.isSuccessful;

      authResponseData = {
        index: socket.playerId,
        name,
        error: !isSuccessful,
        errorText: isSuccessful ? '' : message,
      };
    }

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
    if (error instanceof Error) {
      console.error(error.message);
    }
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
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export {
  handlePlayerAuth,
  handleDisconnect,
};
