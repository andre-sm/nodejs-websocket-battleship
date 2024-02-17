import { Player, PlayerResponse, Room } from '../models/user-models';

const players: Player[] = [];
const rooms: Room[] = [];
const games: Game[] = [];

export const addPlayer = (name: string, password: string, id: number): PlayerResponse => {
  try {
    players.push({ id, name, password });

    return {
      index: id,
      name,
      error: false,
      errorText: '',
    };
  } catch (error) {
    throw new Error('Error while adding new player');
  }
};

export const createRoom = (id: number) => {
  try {
    const newRoom = {
      roomId: id,
      roomUsers: [],
      board: [],
      position: [],
    };
    rooms.push(newRoom);
  } catch (error) {
    throw new Error('Error while new room creation');
  }
};

export const getRoomList = () => {
  try {
    return rooms.filter((room) => room.roomUsers.length === 1).map((room) => ({ roomId: room.roomId, roomUsers: room.roomUsers }));
  } catch (error) {
    throw new Error('Error while getting room list');
  }
};

export const addPlayerToRoom = (roomId: number, playerId: number) => {
  try {
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    const playerIndex = players.findIndex((player) => player.id === playerId);

    const playerData = {
      index: playerId,
      name: players[playerIndex].name,
    };

    const isExist = rooms[roomIndex].roomUsers.find((roomPlayer) => roomPlayer.index === playerId);

    if (!isExist) {
      rooms[roomIndex].roomUsers.push(playerData);
    }

    return rooms[roomIndex].roomUsers.map((user) => user.index);
  } catch (error) {
    throw new Error('Error while adding new player to room');
  }
};

export const createGame = (id: number) => {
  try {
    const newGame = {
      gameId: id,
    };
    games.push(newGame);
  } catch (error) {
    throw new Error('Error while new room creation');
  }
};
