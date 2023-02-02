module.exports = () => {
    const quizzResultService = require('../services/quizzResultService')();

    const store = async (req, res) => {
        try {
            const data = {
                quizz_id: req.params['quizz_id'],
                user_id: req.userId
            };

            const result = await quizzResultService.generateResult(data);

            return res.json(result);
        } catch (error) {
            res.status(500).json({
                message: error || 'Não foi possível postar resultados'
            });
        };
    };

    const show = async (req, res) => {
        try {
            const data = {
                quizz_id: req.params['quizz_id']
            };

            const quizzResult = await quizzResultService.showResult(data);

            return res.json(quizzResult);
        } catch (error) {
            res.status(500).json({
                message: error || 'Não foi possível mostrar resultados'
            });
        };
    };

    return {
        store,
        show
    };
};