module.exports = () => {
    const yup = require('yup');

    const schema = {
        store: {
            body: yup.object().shape({
                option_value: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .required()
            }).noUnknown()
        },

        index: {
            params: yup.object().shape({
                quizz_id: yup.number()
                    .integer()
                    .required()
            }).noUnknown()
        },

        update: {
            body: yup.object().shape({
                option_value: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .required()
            }).noUnknown(),
            params: yup.object().shape({
                quizz_id: yup.number()
                    .integer()
                    .required()
            }).noUnknown()
        }
    };

    return {
        schema
    };
}