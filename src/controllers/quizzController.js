const Quizz = require('../models/Quizz');

module.exports = () => {
    const { pick } = require('lodash');
    const quizzService = require('../services/quizzService');

    const store = async (req, res) => {
        const { options_quantity } = req.data;
        return createQuizz;
    }


    return {
        store,
        login,
        update,
        destroy
    }
}