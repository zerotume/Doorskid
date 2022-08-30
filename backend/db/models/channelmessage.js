'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channelmessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Channelmessage.belongsTo(
        models.Channel,
        {foreignKey:'channelId'}
      )
    }
  }
  Channelmessage.init({
    senderId: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    channelId: {
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    content: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[1,140]
      }
    },
  }, {
    sequelize,
    modelName: 'Channelmessage',
  });
  return Channelmessage;
};
