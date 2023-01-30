module.exports = () => {
    const Quizz = require('../models/Quizz');
    const { Op } = require('Sequelize');

    const createNewQuizz = async data => {
        const isCreatedQuizz = await Quizz.findOne({
            where: {
                user_id: data.user_id,
                title: data.title
            }
        });

        if (isCreatedQuizz) {
            throw new Error('Você já criou um Quizz com este título.');
        };

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

        return quizz;
    };

    const endQuizz = async (filter, change) => {
        const findQuizz = await Quizz.findOne({
            where: {
                user_id: filter.user_id,
                id: filter.quizz_id
            }
        });

        if (!findQuizz) {
            throw new Error('Este Quizz não existe.');
        };

        const quizzEdit = await Quizz.update(change, {
            where: {
                id: filter.quizz_id,
                user_id: filter.user_id
            }
        });

        return quizzEdit;
    };

    const deleteQuizz = async data => {
        const quizz = Quizz.findOne({
            where: {
                id: data.quizz_id,
                user_id: data.user_id
            }
        });

        if (!quizz) {
            throw new Error('Este quizz não existe.')
        };

        await Quizz.destroy({
            where: {
                id: data.quizz_id,
                user_id: data.user_id
            },
            paranoid: false
        });

        return true;
    };

    return {
        createNewQuizz,
        indexQuizz,
        showQuizz,
        endQuizz,
        deleteQuizz
    };

}