const { Router } = require('express');
const routes = Router();

const UserController = require('../controllers/UserController')();
const isLogged = require('../middlewares/isLogged')();
const UserSchema = require('../schema/user')();
const SchemaValidator = require('../utils/schema-validator')();
const rateLimiter = require('../middlewares/rateLimiter')();

routes.post('/signup', [rateLimiter.limitByIp, SchemaValidator.Validate(UserSchema.schema.store)], UserController.store);
routes.post('/login', [rateLimiter.limitByIp, SchemaValidator.Validate(UserSchema.schema.login)], UserController.login);
routes.put('/users/:id/profile', [isLogged.auth, rateLimiter.limitByUser, SchemaValidator.Validate(UserSchema.schema.update)], UserController.update);
routes.delete('/users/:id/profile', [isLogged.auth, rateLimiter.limitByUser], UserController.destroy);

module.exports = routes;