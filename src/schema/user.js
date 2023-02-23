module.exports = () => {
    const yup = require('yup');
    const moment = require('moment');
    const { isValidCpf } = require('../utils/cpf-validator')();
    const sanitizeHtml = require('sanitize-html');

    const schema = {
        store: {
            body: yup.object().shape({
                name: yup.string()
                    .min(5, "it must has at least 5 characters")
                    .max(256, "it must be less than 256 characters.")
                    .transform( value => { return sanitizeHtml(value); })
                    .required(),
                born: yup.date()
                    .test("Invalid date format", null, value => { return moment(value, 'YYYY-MM-DD').isValid(); })
                    .required(),
                cpf: yup.string()
                    .test("Invalid CPF number", null, value => { return isValidCpf(value); })
                    .required(),
                email: yup.string()
                    .max(256, "it must be less than 256 characters")
                    .transform( value => { return sanitizeHtml(value); })
                    .email()
                    .required(),
                password_hash: yup.string()
                    .min(8, "it must has at least 8 characters")
                    .max(16, "it must be less than 16 characters")
                    .transform( value => { return sanitizeHtml(value); })
                    .required(),
            }).noUnknown()
        },

        login: {
            body: yup.object().shape({
                email: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .email()
                    .required(),
                password: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .required()
            }).noUnknown()
        },

        update: {
            body: yup.object().shape({
                name: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .nullable(),
                born: yup.date()
                    .test("Invalid date format", null, value => { return moment(value, 'YYYY-MM-DD').isValid(); })
                    .nullable(),
                email: yup.string()
                    .transform( value => { return sanitizeHtml(value); })
                    .email()
                    .nullable()
            }).noUnknown()
        }
    };

    return {
        schema
    };
}