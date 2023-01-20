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
                message: 'Erro do sistema ao criar usuário'
            });
        }
    };

    const login = async (req, res) => {
        try {
            const data = pick(req.data, ['cpf', 'password']);
            const token = await UserService.loginUser(data);

            return res.json(token);
        } catch (e) {
            return res.status(500).json({
                message: 'Erro do sistema ao logar usuário'
            });
        }
    };

    return {
        store,
        login
    }
}