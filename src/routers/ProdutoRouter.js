const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/ProdutoController');
const verificaToken = require('../middleware/verificarToken');
const verificaRole = require('../middleware/verificarRole'); 

const ROLES = {
  ADMIN: 'admin',
  MUNICIPAL: 'municipal'
};

//Rota de cadastro de produtos
//router.post('/produtos/cadastro', verificaToken, verificaRole([ROLES.ADMIN]), produtoController.cadastrarProduto);//
//Rota para listar produtos
router.get('/produtos/listar', verificaToken, verificaRole([ROLES.ADMIN]),produtoController.listarProdutos);
//Rota para atualizar produto
router.put('/produtos/atualizar/:id', verificaToken, verificaRole([ROLES.ADMIN]), produtoController.atualizarProduto);
//Rota para buscar produto por ID
router.get('/produtos/buscar/:id',verificaToken, verificaRole([ROLES.ADMIN]), produtoController.buscarProdutoPorId);
//Não utilizar essa rota para deletar produtos
router.delete('/produtos/deletar/:id', verificaToken, verificaRole([ROLES.ADMIN]), produtoController.removerProduto);

module.exports = router;