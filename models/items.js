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
  Items.associate = (models) => {
    Items.belongsToMany(models.Guests, {
    	through: 'ItemsOrdered',
    	as: 'guests',
    	foreignKey: 'itemId',
    })
  };
  //sequelize.sync(Items);
  return Items;
};