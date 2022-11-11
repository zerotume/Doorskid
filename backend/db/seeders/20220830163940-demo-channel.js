'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Channels',[
      {
        name:'humanity',
        serverId:1
      },
      {
        name:'digital',
        serverId:1
      },
      {
        name:'catlover',
        serverId:2
      },
      {
        name:'zoos',
        serverId:2
      },
      {
        name:'suggest',
        serverId:3
      },
      {
        name:'rant',
        serverId:3
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Channels',{
      name:{[Op.in]:['s1c1', 's1c2', 's2c1', 's2c2', 's3c1', 's3c2']}
    })
  }
};
