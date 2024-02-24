import {
  Player, Room, Game, RoomPlayerData, CustomShip, Win,
} from '../models/player-models';

const players: { [key: string]: Player; } = {};
const rooms: { [key: string]: Room; } = {};
const games: { [key: string]: Game; } = {};
const winners: { [key: string]: Win; } = {};

export const addPlayer = (name: string, password: string, id: number): { message: string, isSuccessful: boolean } => {
  try {
    const playerWithExistingName = Object.values(players).find((player) => player.name === name);

    if (playerWithExistingName && playerWithExistingName.password !== password) {
      return { message: 'Error: Please enter a correct password', isSuccessful: false };
    }

    players[id] = { id, name, password };
    return { message: '', isSuccessful: true };
  } catch (error) {
    throw new Error('Error while adding new player');
  }
};

export const getPlayer = (id: number): Player => {
  try {
    return players[id];
  } catch (error) {
    throw new Error('Error while adding new player');
  }
};

export const checkPlayerForExistence = (name: string, password: string): Player | undefined => {
  try {
    return Object.values(players).find((player) => player.name === name && player.password === password);
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
    rooms[id] = newRoom;
  } catch (error) {
    throw new Error('Error while new room creation');
  }
};

export const getRoomList = () => {
  try {
    return Object.values(rooms)
      .filter((room) => room.roomUsers.length === 1)
      .map((room) => ({ roomId: room.roomId, roomUsers: room.roomUsers }));
  } catch (error) {
    throw new Error('Error while getting room list');
  }
};

export const addPlayerToRoom = (roomId: number, playerId: number) => {
  try {
    const playerData = {
      index: playerId,
      name: players[playerId].name,
    };

    const isExist = rooms[roomId].roomUsers.find((roomPlayer) => roomPlayer.index === playerId);

    if (!isExist) {
      rooms[roomId].roomUsers.push(playerData);
    }
    return rooms[roomId].roomUsers;
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

export const clearGameData = (playerId: number): number | void => {
  try {
    const roomData = Object.values(rooms).find((room) => room.roomUsers.find((user) => user.index === playerId));
    if (roomData) {
      delete rooms[roomData.roomId];
    }

    const gameData = Object.values(games).find((game) => game.players[playerId]);
    let opponentPlayer;
    if (gameData) {
      opponentPlayer = Object.values(games[gameData.idGame].players).find((player) => player.index !== playerId);
      delete games[gameData.idGame];
    }
    return opponentPlayer?.index;
  } catch (error) {
    throw new Error('Error while removing game data');
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
      throw new Error('Error while adding ships to game board');
    }
  };

export const getActivePlayer = (gameId: number) => {
  try {
    const game = games[gameId];

    if (!game) return;
    const activePlayer = Object.values(game.players).find((player) => player.isActive);
    if (activePlayer) return activePlayer.index;
  } catch (error) {
    throw new Error('Error while getting active player');
  }
};

export const getOpponentPlayer = (gameId: number, currentPlayerId: number) => {
  try {
    return Object.values(games[gameId].players).find((player) => player.index !== currentPlayerId);
  } catch (error) {
    throw new Error('Error while getting opponent player');
  }
};

export const changeActivePlayer = (gameId: number, currentActivePlayerId: number) => {
  try {
    const gamePlayers = Object.values(games[gameId].players);
    gamePlayers.forEach((player) => {
      if (player.index === currentActivePlayerId) {
        games[gameId].players[player.index].isActive = false;
      } else {
        games[gameId].players[player.index].isActive = true;
      }
    });
  } catch (error) {
    throw new Error('Error while changing active player');
  }
};

export const decreaseShipHealth = (gameId: number, playerId: number, shipIndex: number) => {
  try {
    games[gameId].players[playerId].ships[shipIndex].health -= 1;
  } catch (error) {
    throw new Error('Error while decreasing ship health');
  }
};

export const checkShipsHealth = (gameId: number, playerId: number) => {
  try {
    return games[gameId].players[playerId].ships.every((ship) => ship.health === 0);
  } catch (error) {
    throw new Error('Error while checking ships health');
  }
};

export const addWinToTable = (playerId: number) => {
  try {
    const playerName = players[playerId].name;
    if (winners[playerId]) {
      winners[playerId].wins += 1;
    } else {
      winners[playerId] = {
        name: playerName,
        wins: 1,
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error while increasing win for player');
  }
};

export const getWinsTable = () => {
  try {
    return Object.values(winners);
  } catch (error) {
    throw new Error('Error while getting wins table');
  }
};

export const changeBoardCellStatus = (gameId: number, playerId: number, x: number, y: number, status: string) => {
  try {
    games[gameId].players[playerId].board[x][y] = status;
  } catch (error) {
    throw new Error('Error while changeing cell status');
  }
};
