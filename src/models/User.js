const { Model, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: Sequelize.STRING,
            },
            born: {
                type: Sequelize.DATEONLY,
            },
            cpf: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: {
                        msg: 'invalid Email'
                    }
                }
            },
            password_hash: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.VIRTUAL,
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            hooks: {
                beforeCreate: async user => {
                    if(user.password) { user.password_hash = await bcrypt}
                }
            }
        });
        this.addHook('beforeSave', async user => {
            if(user.password) { user.password_hash = bcrypt.hash(user.password, 10)}
        })
    }

    static associate(models) {
        this.hasMany(models.Quizz, { foreignKey: 'user_id' });
        this.hasMany(models.QuizzResult, { foreignKey: 'user_id' })
    }
}

module.exports = User;