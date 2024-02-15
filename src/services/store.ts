import { Player, PlayerResponse } from '../models/user-models';

const players: Player[] = [];

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
