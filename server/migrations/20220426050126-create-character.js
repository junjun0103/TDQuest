'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      status_phy: {
        type: Sequelize.INTEGER
      },
      status_int: {
        type: Sequelize.INTEGER
      },
      status_spi: {
        type: Sequelize.INTEGER
      },
      medal: {
        type: Sequelize.STRING
      },
      phy_name: {
        type: Sequelize.STRING
      },
      int_name: {
        type: Sequelize.STRING
      },
      spi_name: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('characters');
  }
};