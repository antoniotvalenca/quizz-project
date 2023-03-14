const redis = require("redis");

let redisClient = null;

const getRedisClient = () => {
    if (!redisClient) {
        redisClient = redis.createClient();

        redisClient.on("connect", () => {
            console.log("Redis client connected");
        });

        redisClient.on("error", (error) => {
          console.error("Error connecting to Redis:", error);
          process.exit(1);
        });
    }

    return redisClient;
};

module.exports = {
    getRedisClient,
};