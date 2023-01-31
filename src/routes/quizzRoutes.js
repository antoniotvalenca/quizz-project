const { Router } = require('express');
const QuizzController = require('../controllers/QuizzController')();
const QuizzOptionController = require('../controllers/QuizzOptionController')();
const QuizzResultController = require('../controllers/QuizzResultController')();
const isLogged = require('../middlewares/isLogged');
const routes = Router();


routes.post('/quizz/create', isLogged, QuizzController.store);

routes.post('/quizz/preferences/:quizz_id', isLogged, QuizzOptionController.store);
routes.put('/quizz/preferences/:quizz_id', isLogged, QuizzController.update);
routes.delete('/quizz/preferences/:quizz_id', isLogged, QuizzController.destroy);
routes.post('/quizz/preferences/:quizz_id/postresults', isLogged, QuizzResultController.store)

routes.get('/quizz/:quizz_id', isLogged, QuizzOptionController.index);
routes.put('/quizz/:quizz_id', isLogged, QuizzOptionController.update);
routes.get('/quizz/:quizz_id/results', QuizzResultController.show)

routes.get('/quizz/all', QuizzController.index);
routes.get('/quizz/search', QuizzController.show);

module.exports = routes;