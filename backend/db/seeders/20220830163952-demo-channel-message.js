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
   return queryInterface.bulkInsert('Channelmessages',[
    {
      senderId:1,
      channelId:1,
      content:'HelloMeow!'
    },
    {
      senderId:2,
      channelId:1,
      content:'HelloMeow!'
    },
    {
      senderId:1,
      channelId:2,
      content:'HelloMeow!'
    },
    {
      senderId:2,
      channelId:2,
      content:'HelloMeow!'
    },
    {
      senderId:2,
      channelId:1,
      content:'HelloMeow!'
    },
    {
      senderId:3,
      channelId:3,
      content:'HelloMeow!'
    },
    {
      senderId:2,
      channelId:3,
      content:'HelloMeow!'
    },
    {
      senderId:3,
      channelId:4,
      content:'HelloMeow!'
    },
    {
      senderId:1,
      channelId:5,
      content:'HelloMeow!'
    },
    {
      senderId:3,
      channelId:5,
      content:'HelloMeow!'
    },
    {
      senderId:1,
      channelId:6,
      content:'HelloMeow!'
    },
    {
      senderId:3,
      channelId:6,
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
    return queryInterface.bulkDelete('Channelmessages',{
      content:{[Op.like]:['HelloMeow!']}
    })
  }
};
