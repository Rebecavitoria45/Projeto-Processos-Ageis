const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  usuario_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senhaHash: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'municipal'
  },
  municipio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  activationTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
},{
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;