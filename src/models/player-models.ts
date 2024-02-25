import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  playerId: number;
  botInfo: {
    isSinglePlay: boolean;
    botId: number | null;
    gameId: number | null;
  }
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

export interface Coordinate {
  x: number;
  y: number;
}

export interface Ship {
  position: Coordinate;
  direction: boolean;
  length: number;
  type: string;
}

export interface CustomShip extends Ship {
  health: number;
  coordinates: Coordinate[];
}

export interface GamePlayerData {
  index: number;
  name: string;
  ships: CustomShip[];
  board: Array<Array<string>>;
  isActive: boolean;
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

export interface Win {
  name: string;
  wins: number;
}

export interface AttackRequest {
  gameId: number;
  x: number;
  y: number;
  indexPlayer: number;
}
