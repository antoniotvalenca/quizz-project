'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'password', 'password_hash');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'password_hash', 'password');
  }
};
