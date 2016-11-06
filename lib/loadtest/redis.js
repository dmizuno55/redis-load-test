'use strict';
const Redis = require('ioredis');

const redisClientFactory = module.exports;

redisClientFactory.getClient = function() {
  const redis = new Redis(6379, 'localhost');

  return redis;
};
