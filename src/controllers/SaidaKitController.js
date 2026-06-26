const KitSaida = require('../models/SaidaKit');
const Solicitacao = require('../models/Solicitacao')
const { Sequelize } = require('sequelize');

module.exports={

async listarSaidas(req, res) {
  try {
    const saidas = await KitSaida.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json(saidas);
  } catch (error) {
    console.error("Erro ao listar saídas:", error);
    return res.status(500).json({ error: "Erro ao listar saídas." });
  }
},

async listarSaidasPorSolicitacao(req, res) {
  try {
    const { id} = req.params;

    const saidas = await KitSaida.findAll({
      where: { solicitacao_id:id }
    });

    return res.status(200).json(saidas);
  } catch (error) {
    console.error("Erro ao buscar saídas por solicitação:", error);
    return res.status(500).json({ error: "Erro ao consultar saídas." });
  }
}





}