const { Router } = require('express');
const routes = Router();

const UserController = require('../controllers/UserController')();
const isLogged = require('../middlewares/isLogged')();
const UserSchema = require('../schema/user')();
const SchemaValidator = require('../utils/schema-validator')();
const { limit }= require('../middlewares/rateLimiter')();

routes.post('/signup', [(req, res, next) => { limit(req, res, next, "ip") }, SchemaValidator.Validate(UserSchema.schema.store)], UserController.store);
routes.post('/login', [(req, res, next) => { limit(req, res, next, "ip") }, SchemaValidator.Validate(UserSchema.schema.login)], UserController.login);
routes.put('/users/:id/profile', [isLogged.auth, (req, res, next) => { limit(req, res, next, "ip") }, SchemaValidator.Validate(UserSchema.schema.update)], UserController.update);
routes.delete('/users/:id/profile', [isLogged.auth, (req, res, next) => { limit(req, res, next, "ip") }], UserController.destroy);

module.exports = routes;