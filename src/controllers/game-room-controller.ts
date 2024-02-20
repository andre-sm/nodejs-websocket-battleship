import { CustomWebSocket } from '../models/player-models';
import * as store from '../services/store';
import { createId } from '../utils/create-id';
import { broadcastToAll, broadcastToBothDiff } from '../utils/broadcast';

const handleRoomCreation = async (socket: CustomWebSocket): Promise<void> => {
  try {
    const roomId = createId();

    store.createRoom(roomId);
    store.addPlayerToRoom(roomId, socket.playerId);

    broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
    broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

const handleAddToRoom = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { indexRoom } = JSON.parse(data);
    const roomPlayers = store.addPlayerToRoom(indexRoom, socket.playerId);

    if (roomPlayers.length === 2) {
      const gameId = createId();
      store.createGame(gameId, roomPlayers);

      const createGameData = roomPlayers.map((player) => ({
        [player.index]: JSON.stringify({ idGame: gameId, idPlayer: player.index }),
      }));

      broadcastToBothDiff('create_game', createGameData);
    }

    broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
    broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleRoomCreation,
  handleAddToRoom,
};
