module.exports = () => {
    const { pick } = require('lodash');
    const quizzService = require('../services/quizzService');
    const quizzOptionService = require('../services/quizzOptionService');
    const Quizz = require('../models/Quizz');

    const store = async (req, res) => {
        try {
            const data = {
                ...pick(req.data, [
                    'title',
                    'options_quantity',
                    'end_at',
                    'public'
                ]),
                user_id: req.userId
            };

            const quizz = await quizzService.createNewQuizz(data);

            return res.json(quizz);
        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível criar o Quizz'
            });
        };
    };

    const index = async (req, res) => {
        try {
            const data = pick(req.data, ['title']);
            const quizzes = await quizzService.indexQuizz(data);

            return res.json(quizzes);
        } catch (e) {
            return res.status(500).json({
                message: 'Não foi possível listar os Quizzes'
            });
        };
    };

    const show = async (req, res) => {
        try {
            const data = pick(req.filter, ['id']);
            const quizz = await quizzService.showQuizz(data);

            return res.json(quizz);
        } catch (e) {
            res.status(500).json({
                message: 'Não foi possível achar o Quizz'
            });
        };
    };
    const update = async (req, res) => {
        try {
            const change = {
                ...pick(req.data, ['end_at']),
                ongoing: false
            };

            const filter = {
                quizz_id: req.params['quizz_id'],
                user_id: req.userId
            };

            const quizzChanges = await quizzService.endQuizz(filter, change);

            return res.json(quizzChanges);
        } catch (e) {
            return res.status(500).json({
                message: 'Erro ao finalizar Quizz'
            });
        };
    };

    const destroy = async (req, res) => {
        try {
            const data = {
                quizz_id: req.params['quizz_id'],
                user_id: req.userId
            };

            const deletedQuizz = await quizzService.deleteQuizz(data);
            const deletedQuizzOptions = await quizzOptionService.deleteOptions(data.quizz_id);

            return res.json({
                deleted_quizz: deletedQuizz,
                deleted_options: deletedQuizzOptions
            });
        } catch (e) {
            res.status(500).json({
                message: 'Não foi possível deletar o Quizz'
            });
        };
    };

    return {
        store,
        index,
        show,
        update,
        destroy
    };
};