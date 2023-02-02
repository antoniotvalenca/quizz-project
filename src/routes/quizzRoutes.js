const { Router } = require('express');
const QuizzController = require('../controllers/QuizzController')();
const QuizzOptionController = require('../controllers/QuizzOptionController')();
const QuizzResultController = require('../controllers/QuizzResultController')();
const isLogged = require('../middlewares/isLogged');
const routes = Router();


routes.post('/quizz/create', isLogged, QuizzController.store); //ok

routes.post('/quizz/preferences/:quizz_id', isLogged, QuizzOptionController.store); // ok
routes.put('/quizz/preferences/:quizz_id', isLogged, QuizzController.update); // ok
routes.delete('/quizz/preferences/:quizz_id', isLogged, QuizzController.destroy); // ok
routes.post('/quizz/preferences/:quizz_id/postresults', isLogged, QuizzResultController.store); // ok

routes.get('/quizz/all', QuizzController.index);
routes.get('/quizz/search', QuizzController.show);

routes.get('/quizz/:quizz_id/results', QuizzResultController.show); //ok
routes.get('/quizz/:quizz_id', isLogged, QuizzOptionController.index); //ok
routes.put('/quizz/:quizz_id', isLogged, QuizzOptionController.update); // ok

module.exports = routes;