require('dotenv').config();
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import io from 'socket.io';

import { MongoDB, AbstractDatabase } from './config/database';
import { ChatManager } from './chat/chat-IO';

import API_AuthController from './routes/api/auth';
import API_ProfileController from './routes/api/profile';
import API_UserController from './routes/api/users';

export class App {
  private static PORT = process.env.PORT || 4001;
  public io: SocketIO.Server;
  public app: express.Application;
  private http: http.Server;
  private ChatManager: ChatManager;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = io(this.http);
    this.ChatManager = new ChatManager(this.io);
  }

  start(): void {
    if (process.env.NODE_ENV === 'production') {
      //not ready yet
    } else {
      this.middlewares();
      this.routes();
      this.handleErrors();
      this.http.listen(App.PORT, () => {});
    }
  }

  private middlewares(): void {
    this.app.use(morgan('combined'));
    this.app.use(express.json());
    this.app.use(helmet());
  }

  private routes(): void {
    this.app.use('/api/auth', new API_AuthController().router);
    this.app.use('/api/users', new API_UserController().router);
    this.app.use('/api/profile', new API_ProfileController().router);
  }

  private handleErrors() {
    process.on('beforeExit', () => {
      console.log('closing');
    });
  }
}
