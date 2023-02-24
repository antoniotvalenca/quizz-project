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
        let user = await User.findOne({
            where: {
                email: data.email
            }
        });

        const FAKE_PASSWORD = '$2b$09$F5D0n0DPqqTtnovD9fQES.0qYbAgvIdAkZRX.sWCIZFN9ITfkQEBqa332312';
        let isFakeUser = false;

        if (!user) {
            isFakeUser = true;
            user = {
                password_hash: FAKE_PASSWORD
            }
        };

        const validPassword = compareSync(data.password, user.password_hash);

        if (!validPassword || isFakeUser) throw 'E-mail ou senha inválidos';

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