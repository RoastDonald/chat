import { Socket, Server } from 'socket.io';
import Channel, { Message, IMessageDocument } from '../models/Channel';
import { Redis } from '../config/database';

enum ClientEventTypes {
  AUTH = 'client:auth',
  MESSAGE = 'client:message',
  CREATE_CHANNEL = 'client:onFirstMessage',
  LOG_OUT = 'client:logout',
  POCK_USER = 'client:pock-user',
  DISCONNECT = 'disconnect',
}

enum ServerEventTypes {
  MESSAGE = 'server:message',
  CREATE_CHANNEL = 'server:onFirstMessage',
  POCK_USER = 'server:pock-user',
}

interface IAuth {
  data: {
    email: string;
  };
}

export interface IFrom {
  senderEmail: string;
  senderName: string;
}

export interface ITo {
  recieverEmail: string;
  recieverName: string;
}

interface IMessage {
  data: {
    from: {
      senderEmail: string;
      senderName: string;
    };
    to: Array<{ email: string }>;
    message: string;
  };
}

export class ChatManager {
  public static io: Server;
  constructor(io: Server) {
    //init chat
    ChatManager.io = io;
    this.onConnect();
  }

  public getIOServer = (): Server => {
    return ChatManager.io;
  };

  private onConnect = async () => {
    ChatManager.io.on('connection', (socket) => new ConnectedUser(socket));
    ChatManager.io.on('disconnect', this.onDisconnect);
  };

  private onDisconnect = () => {
    console.log('host went down');
  };
}

class ConnectedUser {
  public host: Server = ChatManager.io;
  private userEmail: string = '';
  constructor(public socket: Socket) {
    this.setListeners();
  }

  setListeners = () => {
    this.socket.on(ClientEventTypes.AUTH, this.onAuth);
    this.socket.on(ClientEventTypes.CREATE_CHANNEL, this.onNewRoom);
    this.socket.on(ClientEventTypes.MESSAGE, this.onMessage);
    this.socket.on(ClientEventTypes.POCK_USER, this.onPockUser);
    this.socket.on(ClientEventTypes.LOG_OUT, this.onLogout);
    this.socket.on(ClientEventTypes.DISCONNECT, this.onDisconnect);
  };

  onDisconnect = () => {
    const redis = Redis.database;
    if (!redis || this.userEmail || this.userEmail) return;
    redis.hdel(this.userEmail, 'socketID', (err, isDeleted) => {
      if (err) throw err;
      if (isDeleted) {
      }
    });
  };

  onLogout = (data: any) => {
    const redis = Redis.database;
    if (!redis || !this.host) return;

    const {
      data: { email },
    } = data;

    if (!email) return console.log('somenone else logout');
    redis.hdel(email, 'socketID', (err, isDeleted) => {
      if (err) throw err;
      if (isDeleted) console.log('user went offline');
    });
  };

  onPockUser = async (data: any) => {
    const redis = Redis.database;
    if (!redis || !this.host) return;

    const {
      data: { email, sender },
    } = data;

    const isOnline = await new Promise((res) => {
      redis.hget(email, 'socketID', (err, reply) => {
        if (err) throw err;
        res(!!reply);
      });
    });

    ChatManager.io
      .to(this.socket.id)
      .emit(ServerEventTypes.POCK_USER, isOnline);
  };

  onAuth = (data: IAuth) => {
    const redis = Redis.database;
    if (!redis) return;
    const email = data?.data?.email;
    this.userEmail = email;
    try {
      redis.hset(email, 'socketID', this.socket.id);
    } catch (e) {
      console.log(e);
    }
  };

  onMessage = (data: any) => {
    const redis = Redis.database;
    if (!redis || !this.host) return;
    let {
      data: {
        from: { senderEmail, senderName },
        to,
        message,
        channelID,
        meta,
      },
    } = data;

    to.forEach((user: any) => {
      redis.hget(user.email, 'socketID', (err, socket) => {
        if (err) throw err;
        if (socket) {
          if (!meta) meta = { channelID, message };
          this.host.to(socket).emit('server:message', meta);
        }
      });
    });

    let msg = {
      content: message,
      user: {
        senderName,
        senderEmail,
      },
    } as IMessageDocument;

    Channel.saveMessage(msg, channelID);
  };

  onNewRoom = async (data: any) => {
    const redis = Redis.database;
    if (!redis || !this.host) return;

    const {
      data: { from, to, message },
    } = data;

    await Channel.saveNewRoom(from, to, message).then((channelID) => {
      let clientRoom = {
        _id: channelID,
        creator: from.senderEmail,
        users: [
          { email: from.senderEmail, name: from.senderName },
          { email: to.recieverEmail, name: to.recieverName },
        ],
        messages: [
          {
            content: message,
            timestamp: new Date(),
            user: {
              senderEmail: from.senderEmail,
              senderName: from.senderName,
            },
          },
        ],
      };

      this.socket.emit(ServerEventTypes.CREATE_CHANNEL, clientRoom);
      //if online, emit event
      redis.hget(to.recieverEmail, 'socketID', (err, socket) => {
        if (err) throw err;
        if (socket) {
          this.host
            .to(socket)
            .emit(ServerEventTypes.CREATE_CHANNEL, clientRoom);
        }
      });
    });
  };
}
