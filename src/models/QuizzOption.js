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
            timestamps: true,
            tableName: 'quizz_options',
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        });
    }

    static associate(models) {
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id' });
        this.hasMany(models.QuizzResult, { foreignKey: 'quizz_id' });
    }
}

module.exports = QuizzOption;