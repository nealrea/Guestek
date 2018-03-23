'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Guests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      totalSpent: {
        type: Sequelize.FLOAT
      },
      avgSpent: {
        type: Sequelize.FLOAT
      },
      favItem: {
        type: Sequelize.STRING
      },
      allergies: {
        type: Sequelize.ARRAY
      },
      prevOrdered: {
        type: Sequelize.ARRAY
      },
      genInfo: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Guests');
  }
};