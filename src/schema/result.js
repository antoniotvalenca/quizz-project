module.exports = () => {
    const yup = require('yup');

    const schema = {
        store: {
            params: yup.object().shape({
                quizz_id: yup.number()
                    .integer()
                    .required()
            }).noUnknown()
        },

        show: {
            params: yup.object().shape({
                quizz_id: yup.number()
                    .integer()
                    .required()
            }).noUnknown()
        },
    };

    return {
        schema
    };
}