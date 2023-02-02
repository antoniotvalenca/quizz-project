'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('quizz_results', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('quizz_options', 'created_at');
  }
};