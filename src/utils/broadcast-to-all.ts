import { WebSocketServer } from 'ws';
import { CustomWebSocket } from '../models/user-models';

let wssInstanse: WebSocketServer;

export const setInstanse = (wss: WebSocketServer) => {
  wssInstanse = wss;
};

export const broadcastToAll = (msg: string, userIds: number[] = []) => {
  wssInstanse.clients.forEach((client) => {
    if (userIds.length !== 0) {
      const { userId } = client as CustomWebSocket;
      if (userIds.includes(userId)) {
        client.send(msg);
      }
    } else {
      client.send(msg);
    }
  });
};
