const { Router } = require('express');
const UserController = require('../controllers/UserController')();
const isLogged = require('../middlewares/isLogged');
const routes = Router();

routes.post('/signup', UserController.store);

routes.post('/login', UserController.login);

routes.put('/users/:id/profile', isLogged, UserController.update);
routes.delete('/users/:id/profile', isLogged, UserController.destroy);

module.exports = routes;
