module.exports = () => {
    const RedisStore = require('rate-limit-redis');
    const rateLimit = require("express-rate-limit");
    const redis = require('redis');
    const redisClient = redis.createClient({
      legacyMode: true,
        socket: {
          host: 'localhost',
          port: 6379
        }
    });

    const connectToRedis = async () => {
      try {
        await redisClient.connect();
        console.log('connected');
        return;
      } catch (error) {
        console.log('erro ao conectar: ' + error);
      }
  };

    const limitByUser = async (req, res, next) => {
        rateLimit({
            windowMs: 5 * 60 * 1000,
            max: 2,
            keyGenerator: (req) => { return req.userId },
            // skip: (req) => !req.userId,
            handler: (req, res) => {
              res.status(429).json({ message: 'Too many requests, please try again later.' });
            },
            store: new RedisStore({
              client: redisClient,
              sendCommand: (...args) => redisClient.sendCommand(args)
            })
        });

        return next();
    };

    const limitByIP = async (req, res, next) => {
        rateLimit({
            windowMs: 5 * 60 * 1000,
            max: 2,
            handler: (req, res) => {
              res.status(429).json({ message: 'Too many requests, please try again later.' });
            },
            store: new RedisStore({
              client: redisClient,
              sendCommand: (...args) => redisClient.sendCommand(args)
            })
          });

        return next();
    };

    return {
        limitByUser,
        limitByIP,
        connectToRedis
    }
};