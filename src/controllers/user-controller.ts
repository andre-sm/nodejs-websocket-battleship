import { PlayerAuthData, PlayerResponse, CustomWebSocket } from '../models/user-models';
import { createId } from '../utils/create-id';
import * as store from '../services/store';
import { broadcastToAll } from '../utils/send-to-all';

const handleUserAuth = async (socket: CustomWebSocket, data: string): Promise<void> => {
  try {
    const { name, password }: PlayerAuthData = JSON.parse(data);

    const id = createId();
    socket.userId = id;

    const playerResponse: PlayerResponse = store.addPlayer(name, password, id);
    const authResponse = {
      type: 'reg',
      data: JSON.stringify(playerResponse),
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
