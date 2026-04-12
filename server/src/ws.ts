import { WebSocketServer } from 'ws';
import type { Server } from 'http';

const userConnections = new Map<number, Set<WebSocket>>();
const articleConnections = new Map<number, Set<WebSocket>>();

function getOrSet<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  return set;
}

export function broadcastToUser(userId: number, payload: object) {
  const sockets = userConnections.get(userId);
  if (!sockets) return;
  const msg = JSON.stringify(payload);
  for (const ws of sockets) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

export function broadcastToArticle(articleId: number, payload: object) {
  const sockets = articleConnections.get(articleId);
  if (!sockets) return;
  const msg = JSON.stringify(payload);
  for (const ws of sockets) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

export function startWsServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === 'auth' && typeof data.userId === 'number') {
          getOrSet(userConnections, data.userId).add(ws);
        }
        if (data.type === 'subscribe_article' && typeof data.articleId === 'number') {
          getOrSet(articleConnections, data.articleId).add(ws);
        }
      } catch {
        // ignore invalid JSON
      }
    });

    ws.on('close', () => {
      for (const set of userConnections.values()) set.delete(ws);
      for (const set of articleConnections.values()) set.delete(ws);
    });
  });
}
