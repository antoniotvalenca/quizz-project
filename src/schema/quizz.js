module.exports = () => {
    const yup = require('yup');

    const schema = {
        store: {
            body: yup.object().shape({
                title: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .required(),
                public: yup.boolean()
                    .nullable()
            }).noUnknown()
        },

        index: {
            body: yup.object().shape({
                title: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .required()
            }).noUnknown()
        },

        update: {
            body: yup.object().shape({
                end_at: yup.date()
                    .test("Invalid date format", null, value => { return moment(value, 'YYYY-MM-DD').isValid(); })
                    .required()
            }).noUnknown(),
            params: yup.object().shape({
                quizz_id: yup.number()
                    .integer()
                    .required()
            }).noUnknown()
        }
    }
    return {
        schema
    }
}