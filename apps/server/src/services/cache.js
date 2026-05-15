const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || 'redispass',
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

const get = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const set = async (key, value, ttl = 3600) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

const del = async (key) => {
  await redis.del(key);
};

const delPrefix = async (prefix) => {
  const keys = await redis.keys(`${prefix}*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

redis.on('error', (err) => console.error('Redis Client Error', err));

module.exports = {
  get,
  set,
  del,
  delPrefix,
  client: redis
};