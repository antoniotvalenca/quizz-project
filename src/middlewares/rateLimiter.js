module.exports = () => {
    const moment = require('moment');
    const { getRedisClient } = require('../services/redisService');

    const WINDOW_SIZE_IN_HOURS = 3;
    const MAX_WINDOW_REQUEST_COUNT = 5;
    const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

    const REDIS_KEY_LIMIT_BY_USER_ID = `RATE_LIMIT_BY_USER_ID_`;
    const REDIS_KEY_LIMIT_BY_IP = `RATE_LIMIT_BY_IP_`;

    const getKey = (idOrIp, req) => {
        let key;

        if (idOrIp === "id") {
            key = `${REDIS_KEY_LIMIT_BY_USER_ID}${req.userId}`;
        } else if (idOrIp === "ip") {
            key = `${REDIS_KEY_LIMIT_BY_IP}${req.ip}`;
        }

        return key;
    };

    const redisSetBy = async (idOrIp, req, data) => {
        if (!idOrIp) throw new Error('Wrong middleware parameter at rateLimiter');

        const key = getKey(idOrIp, req);

        return await getRedisClient.set(key, JSON.stringify(data), 3600000)
    };

    const redisGetBy = async (idOrIp, req) => {
        if (!idOrIp) throw new Error('Wrong middleware parameter at rateLimiter');

        const key = getKey(idOrIp, req);

        return await getRedisClient.get(key);
    };

    const limit = async (req, res, next, id_or_ip) => {
        try {
            let record;

            if (!getRedisClient) {
                throw('Redis client does not exist!');
                process.exit
            };

            record = await redisGetBy(id_or_ip, req);

            const currentRequestTime = moment();

            if (!record) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };

                newRecord.push(requestLog);
                await redisSetBy(id_or_ip, req, newRecord)

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

            await redisSetBy(id_or_ip, req, data)

            next();
        } catch (error) {
            res.status(429).json({
                status: 'error',
                message: error.message
            });
        };
    };

    return {
        limit
    };
}