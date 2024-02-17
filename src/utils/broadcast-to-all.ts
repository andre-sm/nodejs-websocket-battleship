import { WebSocketServer } from 'ws';
import { CustomWebSocket } from '../models/user-models';

let wssInstanse: WebSocketServer;

export const setInstanse = (wss: WebSocketServer) => {
  wssInstanse = wss;
};

export const broadcastToAll = (msg: string) => {
  wssInstanse.clients.forEach((client) => {
    client.send(msg);
  });
};

export const broadcastToBoth = (type: string, data: { [key: string]: string; }[]) => {
  wssInstanse.clients.forEach((client) => {
    const { userId } = client as CustomWebSocket;
    const player = data.find((item) => item[userId]);
    if (player) {
      const msg = {
        type,
        data: player[userId],
        id: 0,
      };
      client.send(JSON.stringify(msg));
    }
  });
};
