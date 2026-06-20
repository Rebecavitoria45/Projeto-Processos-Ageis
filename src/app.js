const express = require('express');
const sequelize = require('./config/database');
require('dotenv').config();

const cors = require('cors'); 


// Importa as rotas existentes
const usuarioRouter = require('./routers/usuarioRouter');
const produtoRouter = require('./routers/ProdutoRouter');
const entradaProdutoRoutes = require('./routers/EntradaProdutoRouter');
const kitRouter = require('./routers/kitRouter');
const solicitacaoRouter = require('./routers/SolicitacaoRouter');

// --- Importa os models para o Sequelize conhecê-los ---
const Usuario = require('./models/usuario');
const EntradaProduto = require('./models/EntradaProduto');
const Produto = require('./models/Produto');
const ProdutoKit = require('./models/produtoKit');
const Kit = require('./models/kit'); 
const Solicitacao = require('./models/Solicitacao'); 
const SolicitacaoKit = require('./models/SolicitacaoKit'); 

// --- Configura as Associações ---
// Colocamos os modelos num objeto para facilitar
const models = { Usuario, EntradaProduto, Produto, ProdutoKit, Kit, Solicitacao, SolicitacaoKit};

// Percorre cada modelo e, se tiver o método 'associate', executa ele
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));


app.use(express.json());

app.use('/api', usuarioRouter);
app.use('/api', produtoRouter);
app.use('/api', entradaProdutoRoutes);
app.use('/api', kitRouter);
app.use('/api', solicitacaoRouter);

const startServer = async () => {
    try {
        // Agora o sync vai enxergar TODOS os modelos importados acima
        await sequelize.sync({ alter: true });
        console.log('Banco de dados conectado.');

        const bcrypt = require('bcrypt');

        const adminExists = await Usuario.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            console.log('Nenhum administrador encontrado. Criando usuário admin padrão...');
            const salt = await bcrypt.genSalt(12);
            const senhaHash = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, salt);

            await Usuario.create({
                email: process.env.ADMIN_DEFAULT_LOGIN, 
                senhaHash: senhaHash,
                role: 'admin',
                municipio: null
            });
            console.log('Administrador padrão criado com sucesso.');
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
};

startServer();
