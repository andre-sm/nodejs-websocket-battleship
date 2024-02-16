import { BaseRequest, CustomWebSocket } from '../models/user-models';
import { handleUserAuth } from '../controllers/user-controller';
import { handleRoomCreation } from '../controllers/game-room-controller';

export const handleWsConnection = async (socket: CustomWebSocket) => {
  socket.on('message', (msg: Buffer) => {
    try {
      const { type, data }: BaseRequest = JSON.parse(msg.toString());

      switch (type) {
        case 'reg':
          handleUserAuth(socket, data);
          break;

        case 'create_room':
          handleRoomCreation(socket);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error: Internal server error');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
};
