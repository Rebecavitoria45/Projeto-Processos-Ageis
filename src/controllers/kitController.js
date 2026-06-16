const Kit = require('../models/kit.js');
const Produto = require('../models/Produto');
const ProdutoKit = require('../models/produtoKit.js');
const EntradaProduto = require('../models/EntradaProduto');
const { Sequelize } = require('sequelize');


module.exports = {
    //cadastro de kits
  async criarKit(req, res) {
  const { tipo_kit, quantidade_kit, produtos, origem } = req.body;

  try {
     if (!origem || !['doacao', 'compra'].includes(origem)) {
      return res.status(400).json({
        mensagem: "A origem deve ser 'doacao' ou 'compra'."
      });
    }
    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({
        mensagem: 'É necessário informar produtos para criar um kit.',
      });
    }

    //validação de validade antes de criar qualquer coisa
    for (const item of produtos) {
      if (new Date(item.data_validade) < new Date()) {
        return res.status(400).json({
          mensagem: `O produto "${item.nome_produto}" possui data de validade vencida ${item.data_validade}. O kit não foi cadastrado.`,
        });
      }
    }

    //Criar o Kit
    const novoKit = await Kit.create({
      tipo_kit,
      origem,
      quantidade_kit,
      data_entrada: new Date(),
    });

    // Processar cada produto
    for (const item of produtos) {
      const { nome_produto, quantidade, data_validade } = item;

      const produtoExistente = await Produto.findOne({ where: { nome: nome_produto } });

      let produtoFinal;

      // Se já existe, atualiza estoque
      if (produtoExistente) {
        const novaQuantidade = produtoExistente.quantidade + (quantidade * quantidade_kit);
        await produtoExistente.update({ quantidade: novaQuantidade });
        produtoFinal = produtoExistente;
      } else {
        // Se não existe, cria novo produto
        produtoFinal = await Produto.create({
          nome: nome_produto,
          quantidade: quantidade * quantidade_kit,
          data_validade,
        });
      }

      // Registrar no ProdutoKit
      await ProdutoKit.create({
        kit_id: novoKit.kit_id,
        produto_id: produtoFinal.produto_id,
        nome_produto,
        quantidade,
        data_validade,
      });

      // Registrar entrada de produto
      await EntradaProduto.create({
        data: new Date(),
        quantidade: quantidade * quantidade_kit,
        Produtos_idProdutos: produtoFinal.produto_id,
      });
    }

    return res.status(201).json({
      mensagem: 'Kit criado com sucesso! Estoque atualizado corretamente.',
      kit: novoKit,
    });

  } catch (error) {
    console.error("Erro ao criar kit:", error);
    return res.status(500).json({ mensagem: 'Erro ao criar kit' });
  }
},

async atualizarKit(req, res) {
  try {
    const { id } = req.params;
    const { tipo_kit, quantidade_kit, produtos, origem} = req.body;

    const kit = await Kit.findByPk(id);
    if (!kit) return res.status(404).json({ message: "Kit não encontrado" });

    // Atualiza dados do kit
    await kit.update({ tipo_kit, quantidade_kit,origem });

    // Limpa os produtos do kit antigo
    await ProdutoKit.destroy({ where: { kit_id: id } });

    if (produtos?.length > 0) {
      for (const item of produtos) {
        const { nome_produto, quantidade, data_validade } = item;

        // Verifica se o produto já existe
        let produtoExistente = await Produto.findOne({ where: { nome: nome_produto } });
        let produtoFinal;

        if (produtoExistente) {
          // Atualiza a quantidade no estoque multiplicando pela quantidade do kit
          const novaQuantidade = produtoExistente.quantidade + quantidade * quantidade_kit;
          await produtoExistente.update({ quantidade: novaQuantidade });
          produtoFinal = produtoExistente;
        } else {
          // Cria novo produto no estoque
          produtoFinal = await Produto.create({
            nome: nome_produto,
            quantidade: quantidade * quantidade_kit,
            data_validade,
          });
        }

        // Registra no ProdutoKit
        await ProdutoKit.create({
          kit_id: id,
          produto_id: produtoFinal.produto_id,
          nome_produto,
          quantidade,
          data_validade,
        });

        // Registra entrada de produto
        await EntradaProduto.create({
          data: new Date(),
          quantidade: quantidade * quantidade_kit,
          Produtos_idProdutos: produtoFinal.produto_id,
        });
      }
    }

    return res.status(200).json({
      message: "Kit atualizado com sucesso",
      kit,
    });

  } catch (error) {
    console.error("Erro ao atualizar kit:", error);
    return res.status(500).json({ error: "Erro ao atualizar kit" });
  }
},

async deleteKit(req, res) {
  try {
    const { id } = req.params;

    const kit = await Kit.findByPk(id);
    if (!kit) {
      return res.status(404).json({ message: "Kit não encontrado" });
    }

    // Buscar produtos associados ao kit
    const produtosDoKit = await ProdutoKit.findAll({ where: { kit_id: id } });

    // Ajustar estoque e remover produtos do banco se necessário
    for (const item of produtosDoKit) {
      const produto = await Produto.findByPk(item.produto_id);

      if (produto) {
        const quantidadeSubtrair = item.quantidade * kit.quantidade_kit;
        const novaQuantidade = produto.quantidade - quantidadeSubtrair;

        if (novaQuantidade <= 0) {
          // Remove completamente o produto do estoque
          await produto.destroy();

        } else {
          // Apenas atualiza estoque
          await produto.update({ quantidade: novaQuantidade });
        }

      }
    }

    // Remover vínculos da relação ProdutoKit
    await ProdutoKit.destroy({ where: { kit_id: id } });

    await kit.destroy();

    return res.status(200).json({ 
      message: "Kit deletado e estoque ajustado com sucesso" 
    });

  } catch (error) {
    console.error("Erro ao deletar kit:", error);
    return res.status(500).json({ error: "Erro ao deletar kit" });
  }
},
      
async listarKitsPorTipo(req, res) {
  try {
    const grupos = await Kit.findAll({
      attributes: [
        'tipo_kit',
        [Sequelize.fn('COUNT', Sequelize.col('kit_id')), 'total_kits']
      ],
      group: ['tipo_kit']
    });

    const kits = await Kit.findAll();

    const resposta = grupos.map(grupo => ({
      tipo_kit: grupo.tipo_kit,
      total_kits: grupo.dataValues.total_kits,
      kits: kits.filter(k => k.tipo_kit === grupo.tipo_kit)
    }));

    return res.status(200).json(resposta);

  } catch (error) {
    console.error("Erro ao listar kits agrupados por tipo:", error);
    return res.status(500).json({ error: "Erro ao listar kits agrupados por tipo" });
  }
},
async listarTodosKits(req, res) {
  try {
    const kits = await Kit.findAll();
    return res.status(200).json(kits);

  } catch (error) {
    console.error("Erro ao listar todos os kits:", error);
    return res.status(500).json({ error: "Erro ao listar todos os kits" });
  }
},

//add listar produtos do kit - gabriella - 20/11/25
async listarProdutosDoKit(req, res) {
  try {
    const { id } = req.params;
    const produtos = await ProdutoKit.findAll({
      where: { kit_id: id },
      include: [{ model: Produto }]
    });
    return res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos do kit:", error);
    return res.status(500).json({ error: "Erro ao listar produtos do kit" });
  }
}

};
