const Produto = require('../models/Produto');
require('dotenv').config()


// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ message: 'Erro interno ao listar produtos.' });
  }
};

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, data_validade, quantidade } = req.body;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    produto.nome = nome || produto.nome;
    produto.data_validade = data_validade || produto.data_validade;
    produto.quantidade = quantidade || produto.quantidade;

    await produto.save();

    res.status(200).json({ message: 'Produto atualizado com sucesso!', produto });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar produto.' });
  }
};

// Remover produto
exports.removerProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await produto.destroy();

    res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    res.status(500).json({ message: 'Erro interno ao remover produto.' });
  }
};

// Buscar produto por id
exports.buscarProdutoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto por id:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar produto.' });
  }
};
