import {
  Coordinate,
  CustomShip,
  CustomWebSocket, GamePlayerData,
} from '../models/player-models';
import * as store from '../services/store';
import { broadcastToAll, broadcastToBothDiff, broadcastToBothTheSame } from '../utils/broadcast';
import { getRandomCoordinate } from '../utils/get-random-coordinate';
import { getSurroundCoordinates } from '../utils/get-surround-coordinates';
import { createId } from '../utils/create-id';

const makeBotShot = (
  socket: CustomWebSocket,
  gameId: number,
  board: Array<Array<string>>,
  ships: CustomShip[],
  playersIds: { [key: string]: number },
) => {
  const randomCoordinate = getRandomCoordinate(board) as Coordinate;
  const { x, y } = randomCoordinate;

  if (board[x][y] === '' || board[x][y] === 'miss') {
    let hitShipIndex = -1;
    for (let i = 0; i < ships.length; i += 1) {
      const ship = ships[i];
      if (ship.coordinates.some((coordinate) => coordinate.x === x && coordinate.y === y)) {
        hitShipIndex = i;
      }
    }

    if (hitShipIndex !== -1) {
      store.decreaseShipHealth(gameId, playersIds.player, hitShipIndex);

      const hitShip = ships[hitShipIndex];
      const gameTurnData = JSON.stringify({ currentPlayer: playersIds.bot });

      if (hitShip.health === 0) {
        const killAttackData = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'killed' });
        broadcastToBothTheSame('attack', killAttackData, Object.values(playersIds));

        hitShip.coordinates.forEach((coord) => {
          if (coord.x !== x && coord.y !== y) {
            const killData
              = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'killed' });
            broadcastToBothTheSame('attack', killData, Object.values(playersIds));
          }
          store.changeBoardCellStatus(gameId, playersIds.player, coord.x, coord.y, 'kill');
        });

        const surroundCoordinates = getSurroundCoordinates(hitShip.coordinates);

        surroundCoordinates.forEach((coord) => {
          store.changeBoardCellStatus(gameId, playersIds.player, coord.x, coord.y, 'miss');
          const missAttackData = JSON.stringify({ position: coord, currentPlayer: playersIds.bot, status: 'miss' });

          broadcastToBothTheSame('attack', missAttackData, Object.values(playersIds));
        });

        broadcastToBothTheSame('turn', gameTurnData, Object.values(playersIds));

        const areAllShipsKilled = store.checkShipsHealth(gameId, playersIds.player);

        if (areAllShipsKilled) {
          store.addWinToTable(playersIds.bot);

          const finishData = JSON.stringify({ winPlayer: playersIds.bot });
          broadcastToBothTheSame('finish', finishData, Object.values(playersIds));
          broadcastToAll('update_winners', JSON.stringify(store.getWinsTable()));
        } else {
          setTimeout(() => {
            makeBotShot(socket, gameId, board, ships, playersIds);
          }, 700);
        }
      } else {
        store.changeBoardCellStatus(gameId, playersIds.player, x, y, 'shot');

        const shotAttackData = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'shot' });
        broadcastToBothTheSame('attack', shotAttackData, Object.values(playersIds));
        broadcastToBothTheSame('turn', gameTurnData, Object.values(playersIds));

        setTimeout(() => {
          makeBotShot(socket, gameId, board, ships, playersIds);
        }, 700);
      }
    } else {
      store.changeBoardCellStatus(gameId, playersIds.player, x, y, 'miss');
      store.changeActivePlayer(gameId, playersIds.bot);

      const missAttackData = JSON.stringify({ position: { x, y }, currentPlayer: playersIds.bot, status: 'miss' });
      broadcastToBothTheSame('attack', missAttackData, Object.values(playersIds));
      broadcastToBothTheSame('turn', JSON.stringify({ currentPlayer: playersIds.player }), Object.values(playersIds));
    }
  } else {
    // broadcastToBothTheSame('turn', JSON.stringify({ currentPlayer: playerId }), playersIds);
  }
};

const handleBotAttack = (socket: CustomWebSocket, gameId: number, playerId: number) => {
  const botPlayer = store.getOpponentPlayer(gameId, playerId) as GamePlayerData;
  const socketPlayer = store.getOpponentPlayer(gameId, botPlayer.index) as GamePlayerData;
  const playersIds = { player: playerId, bot: botPlayer.index };

  const { board, ships } = socketPlayer;
  makeBotShot(socket, gameId, board, ships, playersIds);
};

const handleSinglePlay = async (socket: CustomWebSocket): Promise<void> => {
  try {
    const gameId = createId();
    const botId = socket.botInfo.botId || createId();

    if (socket.botInfo.botId) {
      socket.botInfo = { ...socket.botInfo, isSinglePlay: true, gameId };
    } else {
      socket.botInfo = {
        isSinglePlay: true,
        botId,
        gameId,
      };

      store.addPlayer('AI', createId().toString(), botId);
    }

    const playerData = store.getPlayer(socket.playerId);
    const botData = store.getPlayer(botId);

    const gamePlayers = [{ index: socket.playerId, name: playerData.name }, { index: botId, name: botData.name }];
    store.createGame(gameId, gamePlayers);

    const createGameData = gamePlayers.map((player) => ({
      [player.index]: JSON.stringify({ idGame: gameId, idPlayer: player.index }),
    }));
    broadcastToBothDiff('create_game', createGameData);
  } catch (error) {
    console.error('Error: Internal server error', error);
  }
};

export {
  handleBotAttack,
  handleSinglePlay,
};
