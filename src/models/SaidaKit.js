const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


  const SaidaKit = sequelize.define('SaidaKit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    kit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    solicitacao_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: "kit_saida",
    timestamps: true // registra createdAt automaticamente
  });

 module.exports = SaidaKit;

