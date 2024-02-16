import { WebSocketServer } from 'ws';

let wssInstanse: WebSocketServer;

export const setInstanse = (wss: WebSocketServer) => {
  wssInstanse = wss;
};

export const broadcastToAll = (msg: string) => {
  wssInstanse.clients.forEach((client) => {
    client.send(msg);
  });
};
