'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserServerBind extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserServerBind.init({
    userId: DataTypes.INTEGER,
    serverId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserServerBind',
  });
  return UserServerBind;
};