'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('quizz_results', 'option_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('quizz_results', 'option_id');
  }
};