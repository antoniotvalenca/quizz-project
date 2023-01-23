module.exports = () => {
    const User = require('../models/User')
    const Quizz = require('../models/Quizz');
    const { Op, where } = require('Sequelize');

    const createNewQuizz = async data => {
        return await Quizz.create(data);
    };

    const deleteQuizz = async id => {
        await Quizz.destroy({
            where: {
                id: id,
                deleted_at: null
            },
            paranoid: false
        });

        return true;
    };

    return {
        createNewQuizz,
        deleteQuizz
    };

}