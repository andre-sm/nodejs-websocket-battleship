import {
  Player, PlayerResponse, Room, Game, RoomPlayerData, CustomShip,
} from '../models/user-models';

const players: Player[] = [];
const rooms: Room[] = [];
const games: { [key: string]: Game; } = {};

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
    return rooms
      .filter((room) => room.roomUsers.length === 1)
      .map((room) => ({ roomId: room.roomId, roomUsers: room.roomUsers }));
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

    return rooms[roomIndex].roomUsers;
  } catch (error) {
    throw new Error('Error while adding new player to room');
  }
};

export const createGame = (idGame: number, gamePlayers: RoomPlayerData[]) => {
  try {
    const playerOne = gamePlayers[0];
    const playerTwo = gamePlayers[1];

    const newGame = {
      idGame,
      players: {
        [playerOne.index]: {
          ...playerOne,
          ships: [],
          board: [],
          isActive: true,
        },
        [playerTwo.index]: {
          ...playerTwo,
          ships: [],
          board: [],
          isActive: false,
        },
      },
      readyPlayers: 0,
    };

    games[idGame] = newGame;
  } catch (error) {
    throw new Error('Error while new room creation');
  }
};

export const addShipsToGameBoard
  = (gameId: number, playerId: number, ships: CustomShip[], board: Array<Array<string>>) => {
    try {
      const game = games[gameId];
      if (!game) return;
      const player = game.players[playerId];

      if (player) {
        player.ships = ships;
        player.board = board;
        game.readyPlayers += 1;
      }

      if (game.readyPlayers === 2) {
        return Object.values(game.players).map((playerData) => ({
          currentPlayerIndex: playerData.index,
          ships: playerData.ships,
        }));
      }
    } catch (error) {
      throw new Error('Error while adding new player to room');
    }
  };

export const getActivePlayer = (gameId: number) => {
  try {
    const game = games[gameId];
    if (!game) return;
    const activePlayer = Object.values(game.players).find((player) => player.isActive);
    if (activePlayer) return activePlayer.index;
  } catch (error) {
    throw new Error('Error while getting room list');
  }
};
