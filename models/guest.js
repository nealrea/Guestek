'use strict';
module.exports = (sequelize, DataTypes) => {
  var Guest = sequelize.define('Guest', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    totalSpent: DataTypes.FLOAT,
    avgSpent: DataTypes.FLOAT,
    favItem: DataTypes.STRING,
    allergies: DataTypes.ARRAY,
    prevOrdered: DataTypes.ARRAY,
    genInfo: DataTypes.TEXT
  }, {});
  Guest.associate = function(models) {
    // associations can be defined here
  };
  return Guest;
};