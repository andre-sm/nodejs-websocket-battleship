import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  userId: number;
}

export interface BaseRequest {
  type: string;
  data: string;
  id: number;
}

export interface PlayerAuthData {
  name: string;
  password: string;
}

export interface Player {
  id: number;
  name: string;
  password: string;
}

export interface PlayerResponse {
  index: number;
  name: string;
  error: boolean,
  errorText: string;
}

export interface RoomPlayerData {
  index: number;
  name: string;
}

export interface Room {
  roomId: number;
  roomUsers: RoomPlayerData[];
  board: string[];
  position: string[];
}

export interface Ship {
  position: {
    x: number;
    y: number;
  }
  direction: boolean;
  length: number;
  type: string;
}

export interface GamePlayerData {
  index: number;
  name: string;
  ships: Ship[];
}

export interface Game {
  idGame: number;
  readyPlayers: number;
  players: {
    [key: string]: GamePlayerData;
  };
}

export interface GameBoardShipsRequest {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}
