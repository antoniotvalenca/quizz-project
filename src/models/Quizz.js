const { Model, Sequelize } = require('sequelize');

class Quizz extends Model {
    static init(sequelize) {
        super.init({
            user_id: {
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                defaultValue: ''
            },
            options_quantity: {
                type: Sequelize.INTEGER,
            },
            ongoing: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            end_at: {
                type: Sequelize.STRING,
            },
        }, {
            sequelize,
            paranoid: true,
            timestamps: true,
            createdAt: 'started_at',
            deletedAt: 'deleted_at',
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' });
        this.hasMany(models.QuizzOption, { foreignKey: 'quizz_id' }),
        this.hasMany(models.QuizzResult, { foreignKey: 'quizz_id' })
    }
}

module.exports = Quizz;