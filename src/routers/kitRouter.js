const express = require('express');
const router = express.Router();
const kitController = require('../controllers/kitController');
const verificaToken = require('../middleware/verificarToken');
const verificaRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

// Cria kit e cadastra produtos
router.post('/kits/cadastro', verificaToken, verificaRole([ROLES.ADMIN]), kitController.criarKit);

// Listar todos os kits
router.get('/kits/listar', verificaToken, verificaRole([ROLES.ADMIN]), kitController.listarTodosKits);


// Listar kits agrupados por tipo
router.get('/kits/agrupados',verificaToken, verificaRole([ROLES.ADMIN]), kitController.listarKitsPorTipo);

// Atualizar kit
router.put('/kits/:id', verificaToken, verificaRole([ROLES.ADMIN]),kitController.atualizarKit);

// Deletar kit
router.delete('/kits/:id', verificaToken, verificaRole([ROLES.ADMIN]), kitController.deleteKit);




// listagem de produtos dentro do kit - gabriella - 20/11/25
router.get('/kits/:id/produtos', verificaToken, verificaRole([ROLES.ADMIN]), kitController.listarProdutosDoKit);

module.exports = router;