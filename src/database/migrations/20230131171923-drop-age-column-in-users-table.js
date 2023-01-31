'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'age');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
