import WebSocket from 'ws';
import { PlayerAuthData, PlayerResponse } from '../models/user-models';
import * as store from '../services/store';

const handleUserAuth = async (ws: WebSocket, data: string): Promise<void> => {
  try {
    const { name, password }: PlayerAuthData = JSON.parse(data);

    const id = Math.floor(Date.now() * Math.random());

    const playerResponse: PlayerResponse = store.addPlayer(name, password, id);
    const authResponse = {
      type: 'reg',
      data: JSON.stringify(playerResponse),
      id: 0,
    };

    ws.send(JSON.stringify(authResponse));
  } catch (error) {
    console.error('Error: Internal server error');
  }
};

export {
  handleUserAuth,
};
