const { Model, Sequelize } = require('sequelize');

class QuizzResult extends Model {
    static init(sequelize) {
        super.init({
            user_id: {
                type: Sequelize.INTEGER,
            },
            quizz_id: {
                type: Sequelize.INTEGER,
            },
            winner: {
                type: Sequelize.STRING
            },
            win_rate: {
                type: Sequelize.STRING
            },
            option_id: {
                type: Sequelize.STRING
            },
            total_votes: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize
        });
    }

    static associate(models) {
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id' }),
        this.belongsTo(models.User, { foreignKey: 'user_id' }),
        this.belongsTo(models.QuizzOption, { foreignKey: 'option_id' })
    }
}

module.exports = QuizzResult;