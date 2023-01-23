module.exports = () => {
    const { pick } = require('lodash');
    const UserService = require('../services/userService');

    const store = async (req, res) => {
        try {
            const data = pick(req.data, ['name', 'age', 'cpf', 'email', 'password'])
            const users = await UserService.createNewUser(data);

            return res.json(users)

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao criar usuário'
            });
        };
    };

    const login = async (req, res) => {
        try {
            const data = pick(req.data, ['cpf', 'password']);
            const token = await UserService.loginUser(data);

            return res.json(token);

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao logar usuário'
            });
        };
    };

    const update = async (req, res) => {
        try {
            const change = pick(req.data, ['name', 'age', 'email']);
            const filter = pick(req.filter, ['id']);

            const userChanges = await UserService.updateUser(change, filter);

            return res.json(userChanges);

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao atualizar usuário'
            });
        };
    };

    const destroy = async (req, res) => {
        try {
            const { id } = req.filter;
            const deletedUser = await User.deleteUser(id);

            return res.json(deletedUser);

        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao deletar usuário'
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