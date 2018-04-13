'use strict';
module.exports = (sequelize, DataTypes) => {
  var Items = sequelize.define('Items', {
    name: {
    	type: DataTypes.STRING,
    	allowNull: false,
    	validate: {
    		notEmpty: true,
    	},
    },
    price: {
    	type: DataTypes.FLOAT,
    	allowNull: false,
    },
    category: {
    	type: DataTypes.STRING,
    	allowNull: false,
    },
  }, {});
  Items.associate = function(models) {
    // associations can be defined here
  };
  return Items;
};