const { Router } = require('express');
const routes = Router();

const QuizzController = require('../controllers/QuizzController')();
const QuizzOptionController = require('../controllers/QuizzOptionController')();
const QuizzResultController = require('../controllers/QuizzResultController')();

const isLogged = require('../middlewares/isLogged')();

const SchemaValidator = require('../utils/schema-validator')()
const QuizzSchema = require('../schema/quizz')();
const QuizzResultSchema = require('../schema/result')();
const QuizzOptionSchema = require('../schema/option')();

routes.post('/quizz/create', [isLogged, SchemaValidator.validate(QuizzSchema.store)], QuizzController.store); //ok

routes.post('/quizz/preferences/:quizz_id', isLogged, QuizzOptionController.store); // ok
routes.put('/quizz/preferences/:quizz_id', [isLogged, SchemaValidator.validate(QuizzSchema.update)], QuizzController.update); // ok
routes.delete('/quizz/preferences/:quizz_id', isLogged, QuizzController.destroy); // ok
routes.post('/quizz/preferences/:quizz_id/postresults', isLogged, QuizzResultController.store); // ok

routes.get('/quizz/all', QuizzController.index);
routes.get('/quizz/search', QuizzController.show);

routes.get('/quizz/:quizz_id/results', QuizzResultController.show); //ok
routes.get('/quizz/:quizz_id', isLogged, QuizzOptionController.index); //ok
routes.put('/quizz/:quizz_id', isLogged, QuizzOptionController.update); // ok

module.exports = routes;