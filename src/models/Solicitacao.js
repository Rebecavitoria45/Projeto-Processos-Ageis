const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('././models/usuario');

const Solicitacao = sequelize.define('Solicitacao', {
  solicitacao_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data_solicitacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING, 
    defaultValue: 'pendente',
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id',
    }
  },
   quantidade_solicitada: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipo_kit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantidade_atendida: {
  type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: 0
}
  
}, {
  tableName: 'Solicitacoes',
  timestamps: false,
});

Usuario.hasMany(Solicitacao, { foreignKey: 'usuario_id' });
Solicitacao.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = Solicitacao;