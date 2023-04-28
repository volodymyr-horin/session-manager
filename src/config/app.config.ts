import { registerAs } from '@nestjs/config';
import redis from './redis.config';
import postgres from './postgres.config';
import jwt from './jwt.config';

const app = registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10),
  sessionActivityTtl: parseInt(process.env.SESSION_ACTIVITY_TTL, 10),
  sessionBlockTtl: parseInt(process.env.SESSION_BLOCK_TTL, 10),
}));

export default [app, redis, postgres, jwt];
