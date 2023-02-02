const { Model, Sequelize } = require('sequelize');

class QuizzResult extends Model {
    static init(sequelize) {
        super.init({
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
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    }

    static associate(models) {
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id' }),
        this.belongsTo(models.QuizzOption, { foreignKey: 'option_id' })
    }
}

module.exports = QuizzResult;