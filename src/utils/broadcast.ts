import { WebSocketServer } from 'ws';
import { CustomWebSocket } from '../models/player-models';

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
    const { playerId } = client as CustomWebSocket;
    const player = data.find((item) => item[playerId]);
    if (player) {
      const msg = {
        type,
        data: player[playerId],
        id: 0,
      };
      client.send(JSON.stringify(msg));
    }
  });
};
