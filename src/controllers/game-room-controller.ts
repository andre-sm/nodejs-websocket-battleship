import { CustomWebSocket } from '../models/user-models';
import * as store from '../services/store';
import { createId } from '../utils/create-id';
import { broadcastToAll } from '../utils/send-to-all';

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

export {
  handleRoomCreation,
};
