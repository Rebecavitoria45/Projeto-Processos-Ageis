const express = require('express');
const router = express.Router();
const SaidaKitController = require('../controllers/SaidaKitController');
const verificaToken = require('../middleware/verificarToken');
const verificaRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

// Listar todas as saidas de kit
router.get('/saidas', verificaToken, verificaRole([ROLES.ADMIN]),SaidaKitController.listarSaidas);

// Listar as saidas de uma solicitação
router.get('/saidas/:id', verificaToken, verificaRole([ROLES.ADMIN]), SaidaKitController.listarSaidasPorSolicitacao);

module.exports = router;


