const express = require('express');
const router = express.Router();
const solicitacaoController = require('../controllers/SolicitacaoController');
const verificaToken = require('../middleware/verificarToken');
const verificarRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

// Criar solicitação
router.post('/solicitacoes/cadastro', verificaToken, verificarRole([ROLES.MUNICIPAL, ROLES.ADMIN]), solicitacaoController.criarSolicitacao);

// Listar todas solicitações
router.get('/solicitacoes/listar', verificaToken,verificarRole([ROLES.ADMIN]), solicitacaoController.listarSolicitacoes);

// listar solicitação por id
router.get('/solicitacoes/:id', verificaToken,verificarRole([ROLES.ADMIN,ROLES.MUNICIPAL]), solicitacaoController.listarSolicitacaoPorId);

// solicitação por usuario
router.get('/solicitacoes/usuario/:id', verificaToken,verificarRole([ROLES.MUNICIPAL,ROLES.ADMIN]), solicitacaoController.listarSolicitacoesPorUsuario);

//rota para atualizar a solicitação aprovando/rejeitando
router.put('/solicitacoes/:id', verificaToken, verificarRole([ROLES.ADMIN]), solicitacaoController.atualizarSolicitacao);

module.exports = router;