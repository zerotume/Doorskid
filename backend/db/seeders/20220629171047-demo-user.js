'use strict';
const bcrypt = require('bcryptjs');


module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert('Users', [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName:'Demo',
        lastName:'Lition',
        hashedpwd: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName:'Fake',
        lastName:'One',
        hashedpwd: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName:'Fake',
        lastName:'Two',
        hashedpwd: bcrypt.hashSync('password')
      }
    ], {});


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     const Op = Sequelize.Op;
     return queryInterface.bulkDelete('Users', {
       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
     }, {});
  }
};
