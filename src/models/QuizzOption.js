const { Model, Sequelize } = require('sequelize');

class QuizzOption extends Model {
    static init(sequelize) {
        super.init({
            quizz_id: {
                type: Sequelize.INTEGER,
            },
            option_value: {
                type: Sequelize.STRING,
            },
            votes: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            paranoid: true,
            timestamps: true,
            createdAt: 'started_at',
            deletedAt: 'deleted_at',
        });
    }

    static associate(models) {
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id' });
    }
}

module.exports = QuizzOption;