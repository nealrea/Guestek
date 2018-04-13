'use strict';
module.exports = (sequelize, DataTypes) => {
  var ItemsOrdered = sequelize.define('ItemsOrdered', {
    guestId: {
    	type: DataTypes.INTEGER,
    	allowNull: false,
    },
    itemId: {
    	type: DataTypes.INTEGER,
    	allowNull: false,
    },
    timesOrdered: {
    	type: DataTypes.INTEGER,
    	allowNull: false,
    },
  }, {
  	freezeTableName: true
  });
  ItemsOrdered.associate = function(models) {
    // associations can be defined here
  };
  //sequelize.sync(ItemsOrdered);
  return ItemsOrdered;
};