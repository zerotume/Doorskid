'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Directmessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Directmessage.init({
    fromId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    toId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    content: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[1,140]
      }
    }
  }, {
    sequelize,
    modelName: 'Directmessage',
  });
  return Directmessage;
};
