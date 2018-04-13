'use strict';
module.exports = (sequelize, DataTypes) => {
  var Guests = sequelize.define('Guests', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalSpent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    avgSpent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    favItem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allergies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    prevOrdered: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    genInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numVisits: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {});
  Guests.associate = (models) => {
    models.Guests.belongsToMany(models.Items, {
      through: 'ItemsOrdered',
      as: 'itemsOrdered',
    })
  };
  return Guests;
};