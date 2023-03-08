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
const rateLimiter = require('../middlewares/rateLimiter')();

routes.post('/quizz/create', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzSchema.schema.store)], QuizzController.store);

routes.post('/quizz/preferences/:quizz_id', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzOptionSchema.schema.store)], QuizzOptionController.store);
routes.put('/quizz/preferences/:quizz_id', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzSchema.schema.update)], QuizzController.update);
routes.delete('/quizz/preferences/:quizz_id', [isLogged.auth, rateLimiter.limitByUser], QuizzController.destroy);
routes.post('/quizz/preferences/:quizz_id/postresults', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzResultSchema.schema.store)], QuizzResultController.store);

routes.get('/quizz/all', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzSchema.schema.index)],QuizzController.index);
routes.get('/quizz/search', [isLogged.auth], QuizzController.show);

routes.get('/quizz/:quizz_id/results', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzResultSchema.schema.show)], QuizzResultController.show);
routes.get('/quizz/:quizz_id', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzOptionSchema.schema.index)], QuizzOptionController.index);
routes.put('/quizz/:quizz_id', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(QuizzOptionSchema.schema.update)], QuizzOptionController.update);

module.exports = routes;