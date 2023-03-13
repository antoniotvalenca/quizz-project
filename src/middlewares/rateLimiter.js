module.exports = () => {
    const moment = require('moment');
    const redisClient = require('../services/redisService');

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    const WINDOW_SIZE_IN_HOURS = 3;
    const MAX_WINDOW_REQUEST_COUNT = 5;
    const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

    const limit = async (req, res, next, id_or_ip) => {
        try {
            let record;

            if (!redisClient) {
                throw('Redis client does not exist!');
                process.exit
            };

            if (id_or_ip === "id") {
                record = await redisClient.get(req.userId);
            } else if (id_or_ip === "ip") {
                record = await redisClient.get(req.ip);
            } else {
                throw('Wrong middleware parameter at rateLimiter');
            };

            const currentRequestTime = moment();

            if (!record) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                if (id_or_ip === "id") {
                    await redisClient.set(req.userId, JSON.stringify(newRecord));
                } else if (id_or_ip === "ip") {
                    await redisClient.set(req.ip, JSON.stringify(newRecord));
                };

                next();
                return;
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
                throw new Error(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hours limit!`);
            };

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
            };

            if (id_or_ip === "id") {
                await redisClient.set(req.userId, JSON.stringify(data));
            } else if (id_or_ip === "ip") {
                await redisClient.set(req.ip, JSON.stringify(data));
            };

            next();
        } catch (error) {
            res.status(429).json({
                status: 'error',
                message: error.message
            })
        }
    };

    return {
        limit
    };
}