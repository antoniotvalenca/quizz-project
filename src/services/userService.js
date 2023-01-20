module.exports = () => {
    const User = require('../models/User');
    const { compareSync } = require('bcrypt');
    const jwt = require('jsonwebtoken');

    const createNewUser = async data => {
        const user = await User.findOne({
            where: {
                cpf: data.cpf,
            }
        });

        if (user) {
            throw new Error('O usuário com este CPF já está cadastrado');
        };

        return User.create(data)
    }

    const loginUser = async (data) => {
        const user = await User.findOne({
            where: {
                cpf: data.cpf
            },
            raw: true,
            attributes: ['id', 'name', 'cpf', 'age', 'email', 'password_hash']
        });

        if (!user) throw new Error('CPF ou senha inválidos');

        const validPassword = compareSync(data.password, user.password_hash);

        if (!validPassword) throw new Error('CPF ou senha inválidos');

        return jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });
    };

    

    return {
        createNewUser,
        loginUser,
    }
}