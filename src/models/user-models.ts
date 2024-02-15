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
