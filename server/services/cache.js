const redis = require('redis');
const { promisify } = require("util");

let client;
let hgetallAsync;
let hsetAsync;
let expireAsync;
let delAsync;

const connect = () => {
  try {
    client = redis.createClient(process.env.REDIS_URL);

    hgetallAsync = promisify(client.hgetall).bind(client);
    hsetAsync = promisify(client.hset).bind(client);
    expireAsync = promisify(client.expire).bind(client);
    delAsync = promisify(client.del).bind(client);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const get = async (key) => hgetallAsync(key);

const set = async (key, ...rest) => hsetAsync(key, ...rest);

const expire = async (key, seconds) => expireAsync(key, seconds);

const del = async (key) => delAsync(key);

module.exports = {
  connect,
  get,
  set,
  expire,
  del
};
