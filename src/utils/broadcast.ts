import { WebSocketServer } from 'ws';
import { CustomWebSocket } from '../models/player-models';

let wssInstanse: WebSocketServer;

export const setInstanse = (wss: WebSocketServer) => {
  wssInstanse = wss;
};

export const broadcastToAll = (type: string, data: string): void => {
  try {
    const response = {
      type,
      data,
      id: 0,
    };

    wssInstanse.clients.forEach((client) => {
      client.send(JSON.stringify(response));
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const broadcastToBothDiff = (type: string, data: { [key: string]: string; }[]): void => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const broadcastToBothTheSame = (type: string, data: string, playerIds: number[]): void => {
  try {
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
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export const disconnectPlayer = (playerIdToDisconnect: number): void => {
  try {
    wssInstanse.clients.forEach((client) => {
      const { playerId } = client as CustomWebSocket;
      if (playerId === playerIdToDisconnect) {
        client.close();
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
