import { Player, PlayerResponse, Room } from '../models/user-models';

const players: Player[] = [];
const rooms: Room[] = [];

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

export const addPlayerToRoom = (roomId: number, userId: number) => {
  try {
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    const playerIndex = players.findIndex((player) => player.id === userId);

    const playerData = {
      index: userId,
      name: players[playerIndex].name,
    };

    rooms[roomIndex].roomUsers.push(playerData);
  } catch (error) {
    throw new Error('Error while adding new player to room');
  }
};
