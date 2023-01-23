module.exports = () => {
    const QuizzOption = require('../models/QuizzOption');
    const { Op, where } = require('Sequelize');

    const addOption = async data => {
        return await QuizzOption.create(data);
    };

    const indexOptions = async quizz_id => {
        const options = await QuizzOption.findAll({
            attributes: ['option_value'],
            where: {
                quizz_id: quizz_id
            }
        })
    }

    const deleteOption = async quizz_id => {
        await QuizzOption.destroy({
            where: {
                quizz_id: quizz_id,
            },
        });

        return true;
    };


    return {
        addOption,
        indexOptions,
        deleteOption
    };
}