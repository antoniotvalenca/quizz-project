module.exports = () => {
    const Validate = (schema) => {
        return async (req, res, next) => {
            try {
                req.body = Object.keys(req.body).length
                ? await schema.body.validate(req.body) : null;

                req.params = req?.params && Object.keys(req.params).length
                ? await schema.params.validate(req.params) : null;

                return next();
            } catch (error) {
                res.status(401).json({ error });
            };
        };
    };

    return {
        Validate
    };
};