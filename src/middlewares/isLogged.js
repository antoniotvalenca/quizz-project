module.exports = (req, res, next) => {
    const jwt = require('jsonwebtoken');
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: ['Usuário não está logado'],
        });
    }

    const [, token] = authorization.split(' ');

    try {
        const dados = jwt.verify(token, process.env.TOKEN_SECRET);
        const { id, email } = dados;
        req.userId = id;
        req.email = email;
        next();
    } catch (e) {
        return res.status(401).json({
            message: ['Token inspirado ou inválido']
        });
    }
};