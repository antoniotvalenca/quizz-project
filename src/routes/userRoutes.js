const { Router } = require('express');
const routes = Router();

const UserController = require('../controllers/UserController')();
const isLogged = require('../middlewares/isLogged')();
const UserSchema = require('../schema/user')();
const SchemaValidator = require('../utils/schema-validator')();

routes.post('/signup', SchemaValidator.Validate(UserSchema.schema.store), UserController.store);
routes.post('/login',SchemaValidator.Validate(UserSchema.schema.login), UserController.login);
routes.put('/users/:id/profile', [isLogged.auth, SchemaValidator.Validate(UserSchema.schema.update)], UserController.update);
routes.delete('/users/:id/profile', isLogged.auth, UserController.destroy);

module.exports = routes;