'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Channel.belongsTo(
        models.Server,
        {foreignKey:'serverId'}
      );
      Channel.hasMany(
        models.Channelmessage,
        {foreignKey:'channelId', onDelete:'CASCADE', hooks:true}
      );
    }
  }
  Channel.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[1,20],
        isAlphanumeric: true,
      }
    },
    serverId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};
