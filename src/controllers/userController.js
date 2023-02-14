module.exports = () => {
    const { pick } = require('lodash');
    const UserService = require('../services/userService')();

    const store = async (req, res) => {
        try {
            const data = pick(req.body, ['name', 'born', 'cpf', 'email', 'password_hash']);
            const user = await UserService.createNewUser(data);

            return res.json(user)
        } catch (error) {
            return res.status(500).json({
                message: error || 'Erro ao criar o Usuário'
            });
        };
    };

    const login = async (req, res) => {
        try {
            const data = pick(req.body, ['email', 'password']);
            const token = await UserService.loginUser(data);

            return res.json(token);

        } catch (error) {
            return res.status(500).json({
                message: error || 'Erro ao logar Usuário'
            });
        };
    };

    const update = async (req, res) => {
        try {
            const change = pick(req.body, ['name', 'born', 'email']);
            const filter = {
                id: req.userId
            };

            const userChanges = await UserService.updateUser(change, filter);

            return res.json(userChanges);
        } catch (error) {
            return res.status(500).json({
                message: error || 'Erro ao atualizar Usuário'
            });
        };
    };

    const destroy = async (req, res) => {
        try {
            const id = req.userId;
            const deletedUser = await UserService.deleteUser(id);

            return res.json(deletedUser);

        } catch (error) {
            return res.status(500).json({
                message: error || 'Erro ao deletar Usuário'
            });
        };
    };

    return {
        store,
        login,
        update,
        destroy
    };
};