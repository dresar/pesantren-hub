type Message =
  | { type: 'presence_update'; scope: 'article'|'collaboration'; id: number; users: number[]; ts: number }
  | { type: 'article_content'; articleId: number; content: string; userId?: number; ts: number }
  | { type: 'article_updated'; articleId: number; userId?: number; ts: number }
  | { type: 'collaboration_invite'; invite: any }
  | { type: string; [k: string]: any };

export class RealtimeClient {
  private ws?: WebSocket;
  private url: string;
  private handlers: ((msg: Message) => void)[] = [];
  constructor(url?: string) {
    this.url = url || (import.meta.env.VITE_WS_URL || 'ws://localhost:3001');
  }
  connect(userId?: number) {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      if (userId) this.send({ type: 'auth', userId });
    };
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as Message;
        this.handlers.forEach(h => h(msg));
      } catch {}
    };
  }
  onMessage(handler: (msg: Message) => void) {
    this.handlers.push(handler);
  }
  joinArticle(articleId: number) {
    this.send({ type: 'join_article', articleId });
  }
  leaveArticle(articleId: number) {
    this.send({ type: 'leave_article', articleId });
  }
  broadcastArticleContent(articleId: number, content: string) {
    this.send({ type: 'article_content', articleId, content });
  }
  send(payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
  close() {
    this.ws?.close();
  }
}

