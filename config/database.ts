import mongoose, { Mongoose } from 'mongoose';
import redis, { RedisClient } from 'redis';

const RedisOptions: redis.ClientOpts = {
  port: 6379,
};

export abstract class AbstractDatabase {
  abstract connect: () => void;
  abstract disconnect: () => void;
}

export class Redis extends AbstractDatabase {
  static database?: RedisClient;

  constructor() {
    super();
  }

  connect = () => {
    if (Redis.database) return Redis.database;
    try {
      Redis.database = redis.createClient(RedisOptions);
      this.setListeners();
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  };

  disconnect = () => {
    if (!Redis.database) return;
    Redis.database?.quit();
  };

  private setListeners = () => {
    if (!Redis.database) return;
    Redis.database.on('connect', () => {
      console.log('redis connected');
    });

    Redis.database.on('error', (err) => {
      console.log(err);
    });
  };
}

export class MongoDB extends AbstractDatabase {
  static database?: Mongoose;

  constructor() {
    super();
  }

  connect = async () => {
    try {
      const settings = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      };
      MongoDB.database = await mongoose.connect(
        process.env.DB_REMOTE || '',
        settings  
      );  
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  };

  disconnect = async () => {
    try {
      if (mongoose.connection) {
        await mongoose.disconnect();
      }
    } catch (e) {
      process.exit(1);
    }
  };
}
