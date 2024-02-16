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
