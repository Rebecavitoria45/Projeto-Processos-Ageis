const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', //para produção deve ser adicionado um serviço como amazon SES e suas credenciais
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.enviarEmailDeAtivacao = async (emailDestino, activationToken) => {

    const activationLink = `${process.env.FRONTEND_ACTIVATION_URL}?token=${activationToken}`; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailDestino,
        subject: 'Bem-vindo ao Sistema Gerenciador de doações - Ative sua Conta',
        html: `<p>Olá,</p>
               <p>Sua conta foi criada no sistema de Gerenciamento de doações.</p>
               <p>Por favor, clique no link a seguir para criar sua senha (válido por 24 horas):</p>
               <a href="${activationLink}">${activationLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de ativação enviado para ${emailDestino}`);
    } catch (error) {
        console.error(`Erro ao enviar e-mail para ${emailDestino}:`, error);
        throw new Error('Erro ao enviar e-mail de ativação.');
    }
};

exports.enviarEmailDeRedefinicao = async (emailDestino, resetToken) => {
    
    // Ela reutiliza a MESMA URL do frontend, pois a tela de "definir senha" é a mesma
    const resetLink = `${process.env.FRONTEND_ACTIVATION_URL}?token=${resetToken}`; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailDestino,
        subject: 'Sistema Gerenciador de doações - Redefinição de Senha',
        html: `<p>Olá,</p>
               <p>Recebemos uma solicitação para redefinir sua senha.</p>
               <p>Por favor, clique no link a seguir para criar uma nova senha (válido por 1 hora):</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>Se você não solicitou esta redefinição, por favor, ignore este e-mail.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de redefinição enviado para ${emailDestino}`);
    } catch (error) {
        console.error(`Erro ao enviar e-mail para ${emailDestino}:`, error);
        throw new Error('Erro ao enviar e-mail de redefinição.');
    }
};