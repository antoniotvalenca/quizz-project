module.exports = () => {
    const yup = require('yup');

    const schema = {
        store: {
            body: yup.object().shape({
                name: yup.string().required(),
                born: yup.date().required(),
                cpf: yup.string().required(),
                email: yup.string().email().required(),
                password_hash: yup.string().required().min(8),
            }).noUnknown()
        },

        login: {
            body: yup.object().shape({
                email: yup.string().email().required(),
                password: yup.string().required()
            }).noUnknown()
        },

        update: {
            body: yup.object().shape({
                name: yup.string().nullable(),
                born: yup.date().nullable(),
                email: yup.string().email().nullable()
            }).noUnknown()
        }
    };

    return {
        schema
    };
}