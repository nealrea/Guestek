'use strict';
module.exports = (sequelize, DataTypes) => {
  var ItemsOrdered = sequelize.define('ItemsOrdered', {
    timesOrdered: {
    	type: DataTypes.INTEGER,
    	allowNull: false,
    },
  }, {
  	freezeTableName: true
  });
  ItemsOrdered.associate = (models) => {
    ItemsOrdered.belongsTo(models.Guests);
    ItemsOrdered.belongsTo(models.Items);
  };
  //sequelize.sync();
  return ItemsOrdered;
};