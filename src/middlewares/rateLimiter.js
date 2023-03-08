module.exports = () => {
    const moment = require('moment');
    const redisClient = require('../services/redisService');

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    const WINDOW_SIZE_IN_HOURS = 3;
    const MAX_WINDOW_REQUEST_COUNT = 5;
    const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

    const limitByIp = async (req, res, next) => {
        try {
            if (!redisClient) {
            throw('Redis client does not exist!');
            process.exit(1);
            };

            const record = await redisClient.get(req.ip); // vai ter uma chave com o nome sendo o ip do usuario e o valor sendo o nº de vzs que ele fez requisicoes
            const currentRequestTime = moment();

            if (record == null) {
                let newRecord = []; // supondo que nao existe, vai criar um para aquele ip, dando uma contagem inicial de "1" e o tempo que iniciou aquela contagem e um next dps
                let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
                };

                newRecord.push(requestLog);
                await redisClient.set(req.ip, JSON.stringify(newRecord));
                return next();
            };

            let data = JSON.parse(record);
            let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_HOURS, 'hours').unix(); // cria uma variavel que guarda um timestamp de x horas antes da atual req
            let requestsWithinWindow = data.filter( (entry) => { // checa se respeita o time window
                return entry.requestTimeStamp > windowStartTimestamp;
            });

            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount; // checa a quantidade total de req
            }, 0);

            if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) { // checa se atingiu o limite de req
                res.status(429).jsend.error(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`);
            } else {
                let lastRequestLog = data[data.length - 1]; // pega o ultimo req em objeto (com o valor da hora e do contador)
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();

                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                  lastRequestLog.requestCount++;
                  data[data.length - 1] = lastRequestLog;
                } else {
                  data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                  });
                }
                await redisClient.set(req.ip, JSON.stringify(data));
                next();
            }
        } catch (error) {
            next(error);
        }
    };

    const limitByUser = async (req, res, next) => {
        try {
            if (!redisClient) {
            throw('Redis client does not exist!');
            process.exit(1);
            };

            const record = await redisClient.get(req.userId); // vai ter uma chave com o nome sendo o ip do usuario e o valor sendo o nº de vzs que ele fez requisicoes
            const currentRequestTime = moment();

            if (record == null) {
                let newRecord = []; // supondo que nao existe, vai criar um para aquele ip, dando uma contagem inicial de "1" e o tempo que iniciou aquela contagem e um next dps
                let requestLog = {
                requestTimeStamp: currentRequestTime.unix(),
                requestCount: 1,
                };

                newRecord.push(requestLog);
                await redisClient.set(req.userId, JSON.stringify(newRecord));
                return next();
            };

            let data = JSON.parse(record);
            let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_HOURS, 'hours').unix(); // cria uma variavel que guarda um timestamp de x horas antes da atual req
            let requestsWithinWindow = data.filter( (entry) => { // checa se respeita o time window
                return entry.requestTimeStamp > windowStartTimestamp;
            });

            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount; // checa a quantidade total de req
            }, 0);

            if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) { // checa se atingiu o limite de req
                res.status(429).jsend.error(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`);
            } else {
                let lastRequestLog = data[data.length - 1]; // pega o ultimo req em objeto (com o valor da hora e do contador)
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();

                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                  lastRequestLog.requestCount++;
                  data[data.length - 1] = lastRequestLog;
                } else {
                  data.push({
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                  });
                }
                await redisClient.set(req.userId, JSON.stringify(data));
                next();
            }
        } catch (error) {
            next(error);
        }
    }
    return {
        limitByIp,
        limitByUser
    }
}