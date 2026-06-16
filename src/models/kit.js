const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kit = sequelize.define('Kit', {
  kit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo_kit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  origem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_entrada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  quantidade_kit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Kits',
  timestamps: false,
});

module.exports = Kit;
