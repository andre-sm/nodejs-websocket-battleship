import { PlayerAuthData, PlayerResponse, CustomWebSocket } from '../models/player-models';
import { createId } from '../utils/create-id';
import * as store from '../services/store';
import { broadcastToAll } from '../utils/broadcast';

const handleUserAuth = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { name, password }: PlayerAuthData = JSON.parse(data);

    const id = createId();
    socket.playerId = id;

    const isSuccessful = store.addPlayer(name, password, id);

    const authResponseData = {
      index: id,
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
  handleUserAuth,
};
