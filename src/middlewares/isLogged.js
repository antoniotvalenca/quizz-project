module.exports = () => {
    const auth = async (req, res, next) => {
        const jwt = require('jsonwebtoken');
        const { authorization } = req.headers;
        const User = require('../models/User');

        if (!authorization) {
            return res.status(401).json({
                errors: ['Usuário não está logado'],
            });
        };

        const [, token] = authorization.split(' ');

        try {
            const data = jwt.verify(token, process.env.TOKEN_SECRET);
            const { id, email } = data;

            const user = await User.findOne({
                where: {
                    id,
                    email
                },
                raw: true,
            });

            if (!user) throw 'Invalid Credentials'

            req.userId = id;
            req.email = email;

            return next();
        } catch (e) {
            return res.status(401).json({
                message: ['Token inspirado ou inválido']
            });
        }
    };

    return {
        auth
    }
};