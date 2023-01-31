require('./src/database');
const port = 5433;
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const quizzRoutes = require('./src/routes/quizzRoutes');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(quizzRoutes);

app.listen(port, () => {
    console.log('listening on localhost:5433')
});
