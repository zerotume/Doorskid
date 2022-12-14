'use strict';

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

    return queryInterface.bulkInsert('Servers',[
      {
        name:'techlover',
        ownerId:1
      },
      {
        name:'petpet',
        ownerId:2
      },
      {
        name:'random',
        ownerId:3
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Servers',{
      name:{[Op.in]:['server1','server2','server3']}
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
