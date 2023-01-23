const Sequelize = require('sequelize'); // importando sequelize
const dbConfig = require('../config/database'); // importando as credenciais da base de dados

// import dos models
const User = require('../models/User');
const Quizz = require('../models/Quizz');
const QuizzOption = require('../models/QuizzOption');
const QuizzResult = require('../models/QuizzResult');

const connection = new Sequelize(dbConfig); // instanciando o sequelize e passando as credenciais como parâmetro

// inicializando os models
User.init(connection);
Quizz.init(connection);
QuizzOption.init(connection);
QuizzResult.init(connection);

// chamando o associate e passando os models de associaçao
User.associate(connection.models);
Quizz.associate(connection.models);
QuizzOption.associate(connection.models);
QuizzResult.associate(connection.models);

module.exports = connection;