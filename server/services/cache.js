const redis = require('redis');
const { promisify } = require("util");

let client;
let getAsync;
let hmsetAsync;

const connect = () => {
  try {
    client = redis.createClient(process.env.REDIS_URL);
    getAsync = promisify(client.get).bind(client);
    hmsetAsync = promisify(client.hmset).bind(client);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const get = async (key) => getAsync(key);

const set = async (key, value) => hmsetAsync(key, value);

module.exports = {
  connect,
  get,
  set
};
