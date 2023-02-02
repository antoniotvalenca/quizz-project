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
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            hooks: {
                beforeCreate: async user => {
                    if (user.password_hash) {
                        user.password_hash = await bcrypt.hash(user.password_hash, 9)
                    }
                }
            }
        });
    }

    static associate(models) {
        this.hasMany(models.Quizz, { foreignKey: 'user_id' });
    }
}

module.exports = User;