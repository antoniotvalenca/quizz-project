module.exports = () => {
    const User = require('../models/User');
    const { compareSync } = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const { Op } = require('Sequelize');

    const createNewUser = async data => {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { cpf: data.cpf },
                    { email: data.email}
                ]
            }
        });

        if (user) throw 'CPF e/ou E-mail já cadastrados.';

        return await User.create(data)
    };

    const loginUser = async data => {
        const user = await User.findOne({
            where: {
                email: data.email
            }
        });

        if (!user) throw 'CPF/E-mail ou senha inválidos';

        const validPassword = compareSync(data.password, user.password_hash);

        if (!validPassword) throw 'CPF/E-mail ou senha inválidos';

        return jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });
    };

    const updateUser = async (change, filter) => {
        const userEdit = await User.update(change, {
            where: {
                id: filter.id
            }
        });

        return userEdit;
    };

    const deleteUser = async id => {
        const user = await User.findByPk(id);
        return await user.destroy();
    };

    return {
        createNewUser,
        loginUser,
        updateUser,
        deleteUser
    };

}