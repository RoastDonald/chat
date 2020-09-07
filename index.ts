import { App } from './server';
import { Redis, MongoDB } from './config/database';

const mongo = new MongoDB();
const redis = new Redis();
const app = new App();

mongo.connect();
redis.connect();
app.start();
