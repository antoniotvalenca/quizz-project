module.exports = () => {
    const { pick } = require('lodash');
    const quizzOptionService = require('../services/quizzOptionService');
    const Quizz = require('../models/Quizz');

    const store = async (req, res) => {
        try {
            const fullData = {
                ...pick(req.data, [
                    'title',
                    'option_value',
                ]),
                user_id: req.userId
            };

            const findQuizz = await Quizz.findOne({
                where: {
                    user_id: fullData.user_id,
                    title: fullData.title
                }
            });

            if (!findQuizz) {
                throw new Error('Este quizz não existe.')
            };

            const dataOption = {
                ...pick(fullData, [
                    'option_value'
                ]),
                quizz_id: findQuizz.id
            };

            const createdOption = await quizzOptionService.addOption(dataOption);

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
            ...pick(req.data, [
                'title',
            ]),
            user_id: req.userId
            };

            const quizz = await Quizz.findOne({
                where: {
                    title: data.title,
                    user_id: data.user_id
                }
            });

            if (!quizz) {
                throw new Error('Este quizz não existe.')
            };

            const allOptions = await quizzOptionService.indexOptions(quizz.id);

            return res.json(allOptions);

        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível buscar as opções de voto'
            })
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