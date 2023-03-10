module.exports = () => {
    const QuizzOption = require('../models/QuizzOption');

    const addOption = async data => {
        return await QuizzOption.create(data);
    };

    const indexOptions = async data => {
        const options = await QuizzOption.findAll({
            attributes: ['option_value'],
            where: {
                quizz_id: data.quizz_id
            }
        });

        return options;
    };

    const updateOption = async data => {
        const option = await QuizzOption.findOne({
            where: {
                option_value: data.option_value
            }
        });

        if (!option) throw 'Opção inexistente';

        const votingValue = option.votes + 1;

        const optionEdit = await QuizzOption.update({
            votes: votingValue
        }, {
            where: {
                option_value: data.option_value,
                quizz_id: data.quizz_id
            }
        });

        return `Added ${optionEdit} vote`;
    };

    const deleteOptions = async quizz_id => {
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
        updateOption,
        deleteOptions
    };
}