module.exports = () => {
    const { pick } = require('lodash');
    const quizzOptionService = require('../services/quizzOptionService');
    const Quizz = require('../models/Quizz');

    const store = async (req, res) => {
        try {
            const fullData = {
                ...pick(req.data, [
                    'option_value'
                ]),
                quizz_id: req.params['quizz_id'],
                user_id: req.userId
            };

            const findQuizz = await Quizz.findOne({
                where: {
                    user_id: fullData.user_id,
                    id: fullData.quizz_id
                }
            });

            if (!findQuizz) {
                throw new Error('Este Quizz não existe ou já foi encerrado.')
            };

            const finalData = {
                option_value: fullData.option_value,
                quizz_id: fullData.quizz_id
            };

            const createdOption = await quizzOptionService.addOption(finalData);

            return res.json(createdOption);
        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível cadastrar opção de voto.'
            });
        };
    };
    const index = async (req, res) => {
        try {
            const data = {
                quizz_id: req.params['quizz_id'],
            };

            const findQuizz = await Quizz.findOne({
                where: {
                    id: data.quizz_id,
                    ongoing: true,
                    public: true
                }
            });

            if (!findQuizz) {
                throw new Error('Não foi possível encontrar Quizz.');
            };

            const options = await quizzOptionService.indexOptions(data);

            return res.json(options);
        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível buscar as opções de voto'
            });
        };
    };

     const update = async (req, res) => {
        try {
            const data = pick(req.data, ['option_value']);
            const updatedOption = await quizzOptionService.updateOption(data);

            return res.json(updatedOption);
        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível computar voto'
            });
        };
     };

    return {
        store,
        index,
        update,
    };
};