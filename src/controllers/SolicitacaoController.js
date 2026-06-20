const Solicitacao = require('../models/Solicitacao');
const SolicitacaoKit = require('../models/SolicitacaoKit');
const Kit = require('../models/kit');
const Produto = require('../models/Produto');
const ProdutoKit = require('../models/produtoKit');
const Saidakit = require('../models/SaidaKit');
const Usuario = require('../models/usuario');

module.exports={

async criarSolicitacao(req, res) {
  try {
    const { usuario_id, tipo_kit, quantidade_solicitada } = req.body;

    // Buscar o usuário
    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    let observacaoFinal = null;

    // Criar solicitação
    const solicitacao = await Solicitacao.create({
      usuario_id,
      status: "pendente",
      quantidade_solicitada,
      observacao: observacaoFinal,
      tipo_kit: tipo_kit
    });

    return res.status(201).json({
      mensagem: "Solicitação criada com sucesso",
      solicitacao
    });

  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return res.status(500).json({ erro: "Erro ao criar solicitação" });
  }
},
async atualizarSolicitacao(req, res) {
  try {
    const { id } = req.params;
    const { status, observacao } = req.body;

    if (!observacao || observacao.trim() === "") {
      return res.status(400).json({
        message: "Observação é obrigatória para aprovar ou reprovar a solicitação."
      });
    }

    const solicitacao = await Solicitacao.findByPk(id);

    if (!solicitacao) {
      return res.status(404).json({ message: "Solicitação não encontrada." });
    }

    if (!solicitacao.quantidade_solicitada || solicitacao.quantidade_solicitada <= 0) {
      return res.status(400).json({
        message: "A quantidade solicitada é inválida."
      });
    }

    if (status === "reprovado") {
      solicitacao.status = "reprovado";
      solicitacao.observacao = observacao;
      await solicitacao.save();
      return res.status(200).json({ message: "Solicitação reprovada." });
    }

    // ---- APROVAÇÃO ----
    const tipo = solicitacao.tipo_kit;
    const quantidadeSolicitada = solicitacao.quantidade_solicitada;

    const kitsDisponiveis = await Kit.findAll({
      where: { tipo_kit: tipo },
      order: [['quantidade_kit', 'ASC']]
    });

    if (kitsDisponiveis.length === 0) {
      return res.status(400).json({ message: "Não há kits cadastrados desse tipo." });
    }

    const estoqueTotal = kitsDisponiveis.reduce(
      (acc, kit) => acc + kit.quantidade_kit,
      0
    );

    // REGRA 1: Estoque total abaixo de 100
    if (estoqueTotal < 100) {
      solicitacao.status = "reprovado";
      solicitacao.observacao = "Estoque insuficiente.";
      await solicitacao.save();

      return res.status(200).json({
        message: "Solicitação reprovada: estoque total abaixo de 100."
      });
    }

    //REGRA 2: Calcular limite máximo que pode ser atendido sem deixar estoque < 100
    const maxAtendivel = estoqueTotal - 100;

    let totalAtender = Math.min(quantidadeSolicitada, maxAtendivel);
    const atendimentoParcial = totalAtender < quantidadeSolicitada;

    // Se não puder atender nada
    if (totalAtender <= 0) {
      solicitacao.status = "reprovado";
      solicitacao.observacao = "Atendimento impossibilitado, devido a estoque insuficiente.";
      await solicitacao.save();
      return res.status(200).json({
        message: "Solicitação reprovada: não é possível atender sem violar o estoque mínimo."
      });
    }

    // ---- DISTRIBUIÇÃO DE QUANTIDADES ----
    let restante = totalAtender;
    let totalAtendido = 0;

    for (const kit of kitsDisponiveis) {
      if (restante <= 0) break;

      const usar = Math.min(kit.quantidade_kit, restante);

      await SolicitacaoKit.create({
        solicitacao_id: solicitacao.solicitacao_id,
        kit_id: kit.kit_id,
        quantidade_solicitada: quantidadeSolicitada,
        quantidade_atendida: usar
      });

       // REGISTRO DE SAÍDA DO ESTOQUE
      await Saidakit.create({
        kit_id: kit.kit_id,
        solicitacao_id: solicitacao.solicitacao_id,
        quantidade: usar
      });

     await removerKit(kit.kit_id, usar);

      restante -= usar;
      totalAtendido += usar;
    }

    // ---- FINALIZAÇÃO ----
    solicitacao.status = "aprovado";
    solicitacao.observacao = atendimentoParcial
      ? `Atendimento parcial. Solicitado: ${quantidadeSolicitada}. Atendido: ${totalAtendido}.`
      : observacao;

    solicitacao.quantidade_atendida = totalAtendido;
    await solicitacao.save();
    

    return res.status(200).json({
      message: atendimentoParcial
        ? "Solicitação atendida parcialmente."
        : "Solicitação aprovada e atendida totalmente.",
      quantidade_atendida: totalAtendido
    });

  } catch (error) {
    console.error("Erro ao atualizar solicitação:", error);
    return res.status(500).json({ error: "Erro ao atualizar solicitação." });
  }
},

  // LISTAR TODAS AS SOLICITAÇÕES
 async listarSolicitacoes(req, res) {
    try {
      const solicitacoes = await Solicitacao.findAll();
      return res.status(200).json(solicitacoes);

    } catch (error) {
      console.error("Erro ao listar solicitações:", error);
      return res.status(500).json({ error: "Erro ao listar solicitações." });
    }
  },

  // LISTAR SOLICITAÇÃO POR ID
 async listarSolicitacaoPorId(req, res) {
  try {
    const { id } = req.params;

    const solicitacao = await Solicitacao.findByPk(id);

    if (!solicitacao) {
      return res.status(404).json({ message: "Solicitação não encontrada." });
    }

    return res.status(200).json(solicitacao);

  } catch (error) {
    console.error("Erro ao buscar solicitação por ID:", error);
    return res.status(500).json({ error: "Erro ao buscar solicitação por ID." });
  }
},

async listarSolicitacoesPorUsuario(req, res) {
  try {
    const { id } = req.params;

    const solicitacoes = await Solicitacao.findAll({
      where: { usuario_id : id  }
    });

    if (!solicitacoes || solicitacoes.length === 0) {
      return res.status(404).json({ message: "Nenhuma solicitação encontrada para este usuário." });
    }

    return res.status(200).json(solicitacoes);

  } catch (error) {
    console.error("Erro ao listar solicitações do usuário:", error);
    return res.status(500).json({ error: "Erro ao listar solicitações do usuário." });
  }
}
};


// Função para remover um kit completo e atualizar/remover seus produtos
async function removerKit(kitId, quantidadeUsada) {

  const produtosDoKit = await ProdutoKit.findAll({
    where: { kit_id: kitId }
  });

  for (const item of produtosDoKit) {
    const produto = await Produto.findByPk(item.produto_id);

    if (produto) {

      // quantidade total a remover = quantidade_do_produto_no_kit * kits_usados
      const remover = item.quantidade * quantidadeUsada;

      const novaQuantidade = produto.quantidade - remover;

      if (novaQuantidade <= 0) {
        await produto.destroy();
      } else {
        await produto.update({ quantidade: novaQuantidade });
      }
    }
  }

  // reduz a quantidade de kits
  const kit = await Kit.findByPk(kitId);

  const novoEstoqueKit = kit.quantidade_kit - quantidadeUsada;

  if (novoEstoqueKit <= 0) {
    await ProdutoKit.destroy({ where: { kit_id: kitId } });
    await kit.destroy();
  } else {
    await kit.update({ quantidade_kit: novoEstoqueKit });
  }
}
