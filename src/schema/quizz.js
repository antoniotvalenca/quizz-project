module.exports = () => {
    const yup = require('yup');

    const schema = {
        store: {
            body: yup.object().shape({
                title: yup.string().required(),
                public: yup.boolean().nullable()
            }).noUnknown()
        },

        index: {
            body: yup.object().shape({
                title: yup().string().required()
            }).noUnknown()
        },

        update: {
            body: yup.object().shape({
                end_at: yup.date().required()
            }).noUnknown(),
            params: yup.object().shape({
                quizz_id: yup.number().integer().required()
            }).noUnknown()
        }
    }
    return {
        schema
    }
}