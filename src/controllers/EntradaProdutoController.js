const EntradaProduto = require('../models/EntradaProduto');
const Produto = require('../models/Produto');


exports.listarEntradas = async (req, res)=> {
    try {
      const entradas = await EntradaProduto.findAll({
        include: {
          model: Produto,
          attributes: ['produto_id', 'nome', 'quantidade', 'data_validade'],
        },
        order: [['data', 'DESC']],
      });

      res.status(200).json(entradas);
    } catch (error) {
      console.error('Erro ao listar entradas:', error);
      res.status(500).json({ mensagem: 'Erro ao listar entradas.' });
    }
};


exports.listarEntradasPorProduto= async(req, res)=> {
    try {
      const { id } = req.params;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).json({ mensagem: 'Produto não encontrado.' });
      }

      const entradas = await EntradaProduto.findAll({
        where: { Produtos_idProdutos: id },
        include: {
          model: Produto,
          attributes: ['produto_id', 'nome', 'quantidade'],
        },
        order: [['data', 'DESC']],
      });

      if (entradas.length === 0) {
        return res.status(200).json({ mensagem: 'Nenhuma entrada encontrada para este produto.' });
      }

      res.status(200).json(entradas);
    } catch (error) {
      console.error('Erro ao listar entradas por produto:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar entradas por produto.' });
    }
};

