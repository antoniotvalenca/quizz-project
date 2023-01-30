module.exports = () => {
    const { pick } = require('lodash');
    const UserService = require('../services/userService');

    const store = async (req, res) => {
        try {
            const data = pick(req.data, ['name', 'age', 'cpf', 'email', 'password'])
            const user = await UserService.createNewUser(data);

            return res.json(user)

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao criar o Usuário'
            });
        };
    };

    const login = async (req, res) => {
        try {
            const data = pick(req.data, ['cpf', 'email', 'password']);
            const token = await UserService.loginUser(data);

            return res.json(token);

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao logar Usuário'
            });
        };
    };

    const update = async (req, res) => {
        try {
            const change = pick(req.data, ['name', 'age', 'email']);
            const filter = {
                id: req.userId
            };

            const userChanges = await UserService.updateUser(change, filter);

            return res.json(userChanges);
        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao atualizar Usuário'
            });
        };
    };

    const destroy = async (req, res) => {
        try {
            const id = req.userId;
            const deletedUser = await UserService.deleteUser(id);

            return res.json(deletedUser);

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao deletar Usuário'
            });
        };
    };

    return {
        store,
        login,
        update,
        destroy
    }
}