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
      content:'Anyone read the 9th edition of Psychology? That\'s so helpful!'
    },
    {
      senderId:2,
      channelId:1,
      content:'I\'m glad you can get some book helpful to our lives.'
    },
    {
      senderId:1,
      channelId:2,
      content:'Anyone know that how to fix a computer?'
    },
    {
      senderId:2,
      channelId:2,
      content:'Ummm... at least clarifying your question?'
    },
    {
      senderId:2,
      channelId:1,
      content:'Just bought it!'
    },
    {
      senderId:3,
      channelId:3,
      content:'I saw a orange cat outside my door! She\'s so cute!'
    },
    {
      senderId:2,
      channelId:3,
      content:'Really! I love orange kitty!!'
    },
    {
      senderId:3,
      channelId:4,
      content:'I don\'t want to go home, zoo is much better.'
    },
    {
      senderId:2,
      channelId:4,
      content:'Say it again after seeing the orange cat lmao'
    },
    {
      senderId:1,
      channelId:5,
      content:'Any suggestions about what should I wear for the party today? It\'s a birthday party.'
    },
    {
      senderId:3,
      channelId:5,
      content:'All I want to say is, make sure your outfit is something easy to clean, or you don\'t mind if it\'s dirty.'
    },
    {
      senderId:1,
      channelId:6,
      content:'Paid 4 bulks for a t-shirt today. Might be a disposable thing...'
    },
    {
      senderId:3,
      channelId:6,
      content:'Wat, a disposable T-shirt? First time know it. So you just throw it after wearing once??'
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
