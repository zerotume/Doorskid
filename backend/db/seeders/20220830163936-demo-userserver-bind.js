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
   return queryInterface.bulkInsert('UserServerBinds', [
    {
      userId:1,
      serverId:1
    },
    {
      userId:2,
      serverId:1
    },
    {
      userId:2,
      serverId:2
    },
    {
      userId:3,
      serverId:2
    },
    {
      userId:3,
      serverId:3
    },
    {
      userId:1,
      serverId:3
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('UserServerBinds',{
      [Op.and]:[
        {
          userId:{
            [Op.in]:[1,2,3]
          }
        },
        {
          serverId:{
            [Op.in]:[1,2,3]
          }
        }
      ]
    });
  }
};
