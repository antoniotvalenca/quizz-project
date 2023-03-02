require('./src/database');

const express = require('express');
const app = express();

const userRoutes = require('./src/routes/userRoutes');
const quizzRoutes = require('./src/routes/quizzRoutes');

app.use(express.json());
app.use(userRoutes);
app.use(quizzRoutes);

app.listen(3001, async () => {
    console.log('listening on port 3001');
});