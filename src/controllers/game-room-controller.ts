import { CustomWebSocket } from '../models/user-models';
import * as store from '../services/store';
import { createId } from '../utils/create-id';
import { broadcastToAll, broadcastToBoth } from '../utils/broadcast';

const handleRoomCreation = async (socket: CustomWebSocket): Promise<void> => {
  try {
    const roomId = createId();

    store.createRoom(roomId);
    store.addPlayerToRoom(roomId, socket.userId);

    const updateRoomResponse = {
      type: 'update_room',
      data: JSON.stringify(store.getRoomList()),
      id: 0,
    };

    broadcastToAll(JSON.stringify(updateRoomResponse));
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

const handleAddToRoom = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { indexRoom } = JSON.parse(data);
    const roomPlayers = store.addPlayerToRoom(indexRoom, socket.userId);

    if (roomPlayers.length === 2) {
      const gameId = createId();
      store.createGame(gameId, roomPlayers);

      const responseData = roomPlayers.map((player) => ({
        [player.index]: JSON.stringify({ idGame: gameId, idPlayer: player.index }),
      }));

      broadcastToBoth('create_game', responseData);
    }

    const updateRoomResponse = {
      type: 'update_room',
      data: JSON.stringify(store.getRoomList()),
      id: 0,
    };

    broadcastToAll(JSON.stringify(updateRoomResponse));
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleRoomCreation,
  handleAddToRoom,
};
