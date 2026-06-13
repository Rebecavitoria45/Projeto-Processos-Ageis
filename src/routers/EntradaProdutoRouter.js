const express = require('express');
const router = express.Router();
const entradaProdutoController = require('../controllers/EntradaProdutoController');
const verificaToken = require('../middleware/verificarToken');
const verificaRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

// Listar todas as entradas
router.get('/entradas', verificaToken, verificaRole([ROLES.ADMINL]),entradaProdutoController.listarEntradas);

// Listar entradas de um produto específico
router.get('/entradas/:id', verificaToken, verificaRole([ROLES.ADMIN]), entradaProdutoController.listarEntradasPorProduto);

module.exports = router;
