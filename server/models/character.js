'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class character extends Model {
     static associate(models) {
      models.character.belongsTo(models.user, {
        foreignKey: 'user_id'
      })
    }
  }
  character.init({
    image: DataTypes.STRING(5000),
    level: {
      type : DataTypes.INTEGER,
      defaultValue : 1
    },
    status_phy: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    status_int: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    status_spi: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    },
    medal: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'character',
  });
  return character;
};