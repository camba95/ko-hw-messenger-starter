const redis = require('redis');
const { promisify } = require("util");

let client;
let getAsync;
let hsetAsync;
let expireAsync;

const connect = () => {
  try {
    client = redis.createClient(process.env.REDIS_URL);
    getAsync = promisify(client.get).bind(client);
    hsetAsync = promisify(client.hset).bind(client);
    expireAsync = promisify(client.expire).bind(client);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const get = async (key) => getAsync(key);

const set = async (key, ...rest) => hsetAsync(key, ...rest);

const expire = async (key, seconds) => expireAsync(key, seconds);

module.exports = {
  connect,
  get,
  set,
  expire
};
