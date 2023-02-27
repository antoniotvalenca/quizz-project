const express = require('express');
const app = express();

const rateLimit = require("express-rate-limit");
const userRoutes = require('./src/routes/userRoutes');
const quizzRoutes = require('./src/routes/quizzRoutes');

require('./src/database');

const limiter = rateLimit({
    windowsMs: 1 * 60 * 1000,
    max: 2,
    keyGenerator: (req) => req.userId,
    skip: (req) => !req.userId,
    handler: (req, res) => {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
    },
});

app.use(limiter)
app.use(express.json());

app.use(userRoutes);
app.use(quizzRoutes);

app.listen(3001, () => { console.log('listening on port 3001') });
