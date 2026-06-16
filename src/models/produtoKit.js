const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Kit = require('./kit.js');
const Produto = require('./Produto');

const ProdutoKit = sequelize.define('ProdutoKit', {
  produto_kit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Produto,
      key: 'produto_id',
    },
    onDelete: 'SET NULL',
  },
  nome_produto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_validade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'Produtos_Kits',
  timestamps: false,
});

// Relacionamentos
Kit.hasMany(ProdutoKit, { foreignKey: 'kit_id', onDelete: 'CASCADE' });
ProdutoKit.belongsTo(Kit, { foreignKey: 'kit_id' });

Produto.hasMany(ProdutoKit, { foreignKey: 'produto_id' });
ProdutoKit.belongsTo(Produto, { foreignKey: 'produto_id' });

module.exports = ProdutoKit;
