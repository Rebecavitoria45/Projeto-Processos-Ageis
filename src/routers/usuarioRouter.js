const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificaToken = require('../middleware/verificarToken');
const verificaRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

// Rota de login e atualização
router.post('/usuarios/login', usuarioController.loginUsuario);
router.put('/usuarios/:id', verificaToken, usuarioController.atualizarUsuario);
router.post('/usuarios/definir-senha', usuarioController.definirSenha);
router.post('/usuarios/esqueci-senha', usuarioController.esqueciSenha);

// Rotas de gerenciamento, exclusivas para o ADMIN
router.post('/usuarios/cadastrar', verificaToken, verificaRole([ROLES.ADMIN]), usuarioController.cadastrarUsuario);
router.delete('/usuarios/:id', verificaToken, verificaRole([ROLES.ADMIN]), usuarioController.deletarUsuario);

// Rota de listagem, acessível por ADMIN
router.get('/usuarios', verificaToken, verificaRole([ROLES.ADMIN]), usuarioController.listarUsuarios);

// Rota para buscar um usuário específico, com lógica de permissão interna no controller
router.get('/usuarios/:id', verificaToken, usuarioController.buscarUsuarioPorId);

module.exports = router;