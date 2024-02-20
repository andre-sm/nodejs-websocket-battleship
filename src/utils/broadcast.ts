import { WebSocketServer } from 'ws';
import { CustomWebSocket } from '../models/player-models';

let wssInstanse: WebSocketServer;

export const setInstanse = (wss: WebSocketServer) => {
  wssInstanse = wss;
};

export const broadcastToAll = (type: string, data: string) => {
  const response = {
    type,
    data,
    id: 0,
  };

  wssInstanse.clients.forEach((client) => {
    client.send(JSON.stringify(response));
  });
};

export const broadcastToBothDiff = (type: string, data: { [key: string]: string; }[]) => {
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

export const broadcastToBothTheSame = (type: string, data: string, playerIds: number[]) => {
  const response = {
    type,
    data,
    id: 0,
  };

  wssInstanse.clients.forEach((client) => {
    const { playerId } = client as CustomWebSocket;
    const player = playerIds.includes(playerId);
    if (player) {
      client.send(JSON.stringify(response));
    }
  });
};
