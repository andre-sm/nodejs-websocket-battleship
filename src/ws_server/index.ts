import { BaseRequest, CustomWebSocket } from '../models/player-models';
import { handleDisconnect, handlePlayerAuth } from '../controllers/player-controller';
import { handleRoomCreation, handleAddToRoom } from '../controllers/game-room-controller';
import { handleAddShips, handleAttack } from '../controllers/game-play-controller';
import { handleSinglePlay } from '../controllers/bot-play-controller';

export const handleWsConnection = async (socket: CustomWebSocket) => {
  socket.on('message', (msg: Buffer) => {
    try {
      const { type, data }: BaseRequest = JSON.parse(msg.toString());

      switch (type) {
        case 'reg':
          handlePlayerAuth(socket, data);
          break;

        case 'create_room':
          handleRoomCreation(socket);
          break;

        case 'add_user_to_room':
          handleAddToRoom(socket, data);
          break;

        case 'add_ships':
          handleAddShips(socket, data);
          break;

        case 'attack':
          handleAttack(socket, data);
          break;

        case 'randomAttack':
          handleAttack(socket, data);
          break;

        case 'single_play':
          handleSinglePlay(socket);
          break;

        default:
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });

  socket.on('close', () => {
    try {
      handleDisconnect(socket);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });
};
