module.exports = () => {
    const QuizzResult = require('../models/QuizzResult');
    const QuizzOption = require('../models/QuizzOption');
    const Quizz = require('../models/Quizz');

    const generateResult = async data => {
        const findQuizz = await Quizz.findOne({
            where: {
                id: data.quizz_id,
                user_id: data.user_id,
                ongoing: false,
                deleted_at: null
            }
        });

        if (!findQuizz) {
            throw new Error('Este quizz não existe, não pertence a este usuário ou foi encerrado.')
        };

        const allOptions = await QuizzOption.findAll({
            attributes: [
                'option_value',
                'votes'
            ],
            where: {
                quizz_id: data.quizz_id
            }
        });

        let votesArr = [];

        for(const key in allOptions){
            votesArr.push(allOptions[key].votes)
        };

        const getMaxOfArray = arr => {
            return Math.max.apply(null, arr);
        };

        const winner = await QuizzOption.findOne({
            where: {
                quizz_id: data.quizz_id,
                votes: getMaxOfArray(votesArr)
            }
        });

        const sumArray = votesArr.reduce((accumulator, value) => {
            return accumulator + value;
        });

        const results = {
            user_id: winner.user_id,
            quizz_id: winner.quizz_id,
            winner: winner.option_value,
            win_rate: `${(getMaxOfArray(votesArr)*100)/(sumArray)}%`,
            option_id: winner.id,
            total_votes: sumArray
        };

        return await QuizzResult.create(results);
    };

    const showResult = async data => {
        const quizzResult = await QuizzResult.findOne({
            attributes: [
                winner,
                win_rate,
                total_votes
            ],
            where: {
                quizz_id: data.quizz_id
            }
        });

        if (!quizzResult) {
            throw new Error('Os resultados ainda não foram gerados.')
        };

        return quizzResult;
    };

    return {
        generateResult,
        showResult,
    };
}