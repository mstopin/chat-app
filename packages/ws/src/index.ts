import 'dotenv/config';

import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import url from 'url';

import { Redis } from './Redis';
import { EventListener } from './EventListener';

const APP_PORT = process.env['APP_PORT'];
if (!APP_PORT) {
  throw new Error('Invalid app port');
}

(async function app() {
  const redis = new Redis();
  const eventListener = new EventListener(redis);

  const http = createServer();
  const wss = new WebSocketServer({ noServer: true });

  const users = new Map<string, WebSocket>();

  eventListener.setEventHandler((event) => {
    event.recipientIds.forEach((rId) => {
      users.get(rId)?.send(
        JSON.stringify({
          type: event.type,
          payload: event.payload,
        })
      );
    });
  });
  await eventListener.start();

  http.on('upgrade', async (req, socket, head) => {
    try {
      const query = url.parse(req.url!, true).query;
      const access_token = query.access_token;
      if (!access_token) {
        throw new Error('No access token');
      }

      const userId = await redis
        .getClient()
        .get(`events.tokens.${access_token}.user`);
      if (!userId) {
        throw new Error('Invalid access token');
      }

      wss.handleUpgrade(req, socket, head, (client) => {
        users.set(userId, client);

        client.on('close', () => {
          users.delete(userId);
        });
      });
    } catch {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  http.listen(APP_PORT);
})().catch(console.error);
