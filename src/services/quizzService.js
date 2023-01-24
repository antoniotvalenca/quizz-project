module.exports = () => {
    const Quizz = require('../models/Quizz');
    const { Op, where } = require('Sequelize');

    const createNewQuizz = async data => {
        return await Quizz.create(data);
    };

    const indexQuizz = async data => {
        const publicQuizzes = await Quizz.findAll({
            attributes: [
                'title',
                'user_id',
            ],
            where: {
                title: {
                    [Op.iLike]: `%${data.title}`
                },
                ongoing: true,
                public: true
            }
        });

        return publicQuizzes;
    };

    const showQuizz = async filter => {
        const quizz = await Quizz.findOne({
            where: {
                id: filter.id,
                ongoing: true,
                public: true
            }
        });

        return quizz
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
        indexQuizz,
        showQuizz,
        deleteQuizz
    };

}