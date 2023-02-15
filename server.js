const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const quizzRoutes = require('./src/routes/quizzRoutes');
const app = express();

require('./src/database');

app.use(express.json());

app.use(userRoutes);
app.use(quizzRoutes);

app.listen(3001, () => { console.log('listening on port 3001') });
