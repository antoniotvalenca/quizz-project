module.exports = () => {
    const { pick } = require('lodash');
    const quizzOptionService = require('../services/quizzOptionService')();
    const Quizz = require('../models/Quizz');

    const store = async (req, res) => {
        try {
            const fullData = {
                ...pick(req.body, [
                    'option_value'
                ]),
                quizz_id: req.params['quizz_id'],
                user_id: req.userId
            };

            const findQuizz = await Quizz.findOne({
                where: {
                    user_id: fullData.user_id,
                    id: fullData.quizz_id,
                    ongoing: true,
                    deleted_at: null
                }
            });

            if (!findQuizz) throw 'Este Quizz não existe ou já foi encerrado.'

            const finalData = {
                option_value: fullData.option_value,
                quizz_id: fullData.quizz_id
            };

            const createdOption = await quizzOptionService.addOption(finalData);

            return res.json(createdOption);
        } catch (error) {
            return res.status(500).json({
                message: error || 'Não foi possível cadastrar opção de voto.'
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

            if (!findQuizz) throw 'Não foi possível encontrar Quizz.';

            const options = await quizzOptionService.indexOptions(data);

            return res.json(options);
        } catch (error) {
            return res.status(500).json({
                message: error || 'Não foi possível buscar as opções de voto'
            });
        };
    };

     const update = async (req, res) => {
        try {
            const data = {
                ...pick(req.body, ['option_value']),
                quizz_id: req.params['quizz_id']
            };
            const updatedOption = await quizzOptionService.updateOption(data);

            return res.json(updatedOption);
        } catch (error) {
            return res.status(500).json({
                message: error || 'Não foi possível computar voto'
            });
        };
     };

    return {
        store,
        index,
        update,
    };
};