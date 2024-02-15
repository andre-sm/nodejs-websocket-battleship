import { WebSocket } from 'ws';
import { BaseRequest } from '../models/user-models';
import { handleUserAuth } from '../controllers/user-controller';

export const handleWsConnection = async (ws: WebSocket) => {
  ws.on('message', (msg: string) => {
    try {
      const { type, data }: BaseRequest = JSON.parse(msg);

      switch (type) {
        case 'reg':
          handleUserAuth(ws, data);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error: Internal server error');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
};
