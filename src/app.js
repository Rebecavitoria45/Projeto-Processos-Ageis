const sequelize = require('./config/database');
require('dotenv').config();

async function connectWithRetry() {
    while (true) {
        try {
            await sequelize.authenticate();
            console.log('Conexão com o banco de dados realizada com sucesso!');
            break; 
        } catch (error) {
            console.error('Banco ainda não disponível. Tentando novamente em 5 segundos...');
            console.error(error.message);

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

connectWithRetry();
