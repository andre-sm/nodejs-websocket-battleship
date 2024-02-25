import { CustomWebSocket } from '../models/player-models';
import * as store from '../services/store-service';
import { createId } from '../utils/create-id';
import { broadcastToAll, broadcastToBothDiff } from '../utils/broadcast';

const handleRoomCreation = (socket: CustomWebSocket): void => {
  try {
    const roomId = createId();

    store.createRoom(roomId);
    store.addPlayerToRoom(roomId, socket.playerId);

    broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
    broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

const handleAddToRoom = (socket: CustomWebSocket, data: string): void => {
  try {
    const { indexRoom } = JSON.parse(data);
    const roomPlayers = store.addPlayerToRoom(indexRoom, socket.playerId);

    if (roomPlayers?.length === 2) {
      const gameId = createId();
      store.createGame(gameId, roomPlayers);

      const createGameData = roomPlayers.map((player) => ({
        [player.index]: JSON.stringify({ idGame: gameId, idPlayer: player.index }),
      }));

      broadcastToBothDiff('create_game', createGameData);
      store.deletePlayersRooms(roomPlayers.map((player) => player.index));
    }

    broadcastToAll('update_room', JSON.stringify(store.getRoomList()));
    broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export {
  handleRoomCreation,
  handleAddToRoom,
};
