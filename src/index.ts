import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { httpServer } from './http_server/index';
import { handleWsConnection } from './ws_server';

dotenv.config();
const httpPort = process.env.HTTP_PORT || 8181;
const wsPort = Number(process.env.WS_PORT) || 3000;

httpServer.listen(httpPort, () => {
  console.log(`HTTP server listening on port ${httpPort}`);
});

const wss = new WebSocketServer({ port: wsPort });

console.log(`Websocket server listening on port ${wsPort}`);

wss.on('connection', handleWsConnection);
