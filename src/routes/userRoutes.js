const { Router } = require('express');
const routes = Router();

const rateLimit = require('../middlewares/rateLimit')();
const UserController = require('../controllers/UserController')();
const isLogged = require('../middlewares/isLogged')();
const UserSchema = require('../schema/user')();
const SchemaValidator = require('../utils/schema-validator')();

routes.post('/signup', [rateLimit.limitByIP, SchemaValidator.Validate(UserSchema.schema.store)], UserController.store);
routes.post('/login', [rateLimit.limitByIP, SchemaValidator.Validate(UserSchema.schema.login)], UserController.login);
routes.put('/users/:id/profile', [isLogged.auth, rateLimit.limitByUser, SchemaValidator.Validate(UserSchema.schema.update)], UserController.update);
routes.delete('/users/:id/profile', [isLogged.auth, rateLimit.limitByUser], UserController.destroy);

module.exports = routes;