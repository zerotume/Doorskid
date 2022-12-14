'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Server extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Server.belongsToMany(
        models.User,
        {through: models.UserServerBind, foreignKey:'serverId'}
      );
      Server.hasMany(
        models.Channel,
        {foreignKey:'serverId', onDelete:'CASCADE', hooks:true}
      );
    }
  }
  Server.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[1,20],
        isAlphanumeric: true,
      }
    },
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Server',
    defaultScope:{
      attributes:["id","name","ownerId","createdAt","updatedAt"]
    }
  });
  return Server;
};
