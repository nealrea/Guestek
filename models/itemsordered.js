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
  }, {});
  ItemsOrdered.associate = function(models) {
    // associations can be defined here
  };
  return ItemsOrdered;
};