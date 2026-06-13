const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Produto = require('./Produto');

const EntradaProduto = sequelize.define('Entrada_produto', {
  id_entrada: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'Entrada_produto',
  timestamps: false,
});

// relacionamento (FK)
Produto.hasMany(EntradaProduto, {
  foreignKey: 'Produtos_idProdutos',   // Um produto tem várias entradas
});
EntradaProduto.belongsTo(Produto, {
  foreignKey: 'Produtos_idProdutos',    // Uma entrada pertence a um produto
});

module.exports = EntradaProduto;
