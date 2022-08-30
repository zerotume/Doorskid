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
   return queryInterface.bulkInsert('Directmessages',[
    {
      fromId:1,
      toId:2,
      content:'HelloMeow!'
    },
    {
      fromId:2,
      toId:1,
      content:'HelloMeow!'
    },
    {
      fromId:1,
      toId:3,
      content:'HelloMeow!'
    },
    {
      fromId:3,
      toId:1,
      content:'HelloMeow!'
    },
    {
      fromId:2,
      toId:3,
      content:'HelloMeow!'
    },
    {
      fromId:3,
      toId:2,
      content:'HelloMeow!'
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
     return queryInterface.bulkDelete('Directmessages',{
       content:{[Op.like]:['HelloMeow!']}
     });
  }
};
