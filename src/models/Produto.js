const {DataTypes} = require('sequelize')
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
    produto_id:{ 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
nome:{
    type: DataTypes.STRING,
    allowNull: false,
},
data_validade:{
    type: DataTypes.DATE,

},
quantidade:{
    type:DataTypes.INTEGER,
    allowNull: false,
},
},{
tableName:'Produto',
timestamps: false
})
module.exports = Produto