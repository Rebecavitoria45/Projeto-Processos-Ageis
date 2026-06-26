const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Solicitacao = require('./Solicitacao');
const Kit = require('./kit'); 

const SolicitacaoKit = sequelize.define('SolicitacaoKit', {
  solicitacao_kit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  solicitacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Solicitacao,
      key: 'solicitacao_id',
    },
    onDelete: 'CASCADE',
  },
  kit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Kit,
      key: 'kit_id',
    },
    onDelete: 'CASCADE',
  },
  quantidade_solicitada: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  quantidade_atendida: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'Solicitacoes_Kits',
  timestamps: false,
});

Solicitacao.hasMany(SolicitacaoKit, { foreignKey: 'solicitacao_id', as: 'itensSolicitados', onDelete: 'CASCADE' });
SolicitacaoKit.belongsTo(Solicitacao, { foreignKey: 'solicitacao_id', as: 'solicitacao' });

Kit.hasMany(SolicitacaoKit, { foreignKey: 'kit_id', onDelete: 'CASCADE' });
SolicitacaoKit.belongsTo(Kit, { foreignKey: 'kit_id', as: 'kit' });

module.exports = SolicitacaoKit;