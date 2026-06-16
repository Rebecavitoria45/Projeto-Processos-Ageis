const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const { Sequelize } = require('sequelize'); 
const emailService = require('../services/emailService');
require('dotenv').config();

exports.cadastrarUsuario = async (req, res) => {
    try {
        const { email, role, municipio } = req.body;
        if (!email) {
            return res.status(422).json({ msg: 'O e-mail é obrigatório.' });
        }

        let usuario = await Usuario.findOne({ where: { email: email } });
        if (usuario) {
            return res.status(422).json({ error: 'E-mail já cadastrado.' });
        }

        const activationToken = crypto.randomBytes(32).toString('hex');

        usuario = await Usuario.create({ 
            email, 
            senhaHash: null, 
            role, 
            municipio,
            activationToken: activationToken,
            activationTokenExpires: Date.now() + 24 * 3600000 // Expira em 24 horas
        });
        
        await emailService.enviarEmailDeAtivacao(usuario.email, activationToken);

        res.status(201).json({ 
            msg: 'Usuário convidado com sucesso. Um e-mail de ativação foi enviado.', 
            id: usuario.usuario_id
        });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        if (error.message === 'Erro ao enviar e-mail de ativação.') {
            return res.status(500).json({ error: 'Usuário criado, mas falha ao enviar o e-mail de ativação.' });
        }
        res.status(500).json({ error: 'Ocorreu um erro interno.' });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(422).json({ msg: 'Email e senha são obrigatórios.' });
        }

        const usuario = await Usuario.findOne({ where: { email: email } });
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário ou senha inválidos.' });
        }

        if (!usuario.senhaHash) {
            return res.status(403).json({ error: 'Conta não ativada. Verifique seu e-mail para definir uma senha.' });
        }

        const checkSenha = await bcrypt.compare(senha, usuario.senhaHash);
        if (!checkSenha) {
            return res.status(422).json({ msg: 'Usuário ou senha inválidos.' });
        }

        const secret = process.env.SECRET;
        const token = jwt.sign(
            { id: usuario.usuario_id, email: usuario.email, role: usuario.role },
            secret,
            { expiresIn: '8h' }
        );
        
        res.status(200).json({ msg: 'Autenticação bem-sucedida', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno.' });
    }
};

exports.definirSenha = async (req, res) => {
    try {
        const { token, senha } = req.body;
        if (!token || !senha) {
            return res.status(422).json({ msg: 'Token e senha são obrigatórios.' });
        }

        const usuario = await Usuario.findOne({ 
            where: { 
                activationToken: token,
                activationTokenExpires: { [Sequelize.Op.gt]: Date.now() } 
            }
        });

        if (!usuario) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const salt = await bcrypt.genSalt(12);
        usuario.senhaHash = await bcrypt.hash(senha, salt);
        usuario.activationToken = null;
        usuario.activationTokenExpires = null;
        await usuario.save();

        res.status(200).json({ msg: 'Senha definida com sucesso! Você já pode fazer o login.' });

    } catch (error) {
        console.error('Erro ao definir senha:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno.' });
    }
};

exports.esqueciSenha = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (usuario) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            
            usuario.activationToken = resetToken;
            usuario.activationTokenExpires = Date.now() + 3600000; // expira em 1 hora 
            await usuario.save();

            await emailService.enviarEmailDeRedefinicao(usuario.email, resetToken);
        }

        res.status(200).json({ msg: 'Se um e-mail cadastrado for encontrado, um link de redefinição será enviado.' });

    } catch (error) {
        console.error('Erro no fluxo de "esqueci a senha":', error);
        // Mesmo em caso de erro interno, enviamos uma resposta genérica
        res.status(200).json({ msg: 'Se um e-mail cadastrado for encontrado, um link de redefinição será enviado.' });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['usuario_id', 'email', 'role', 'municipio']
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
};

exports.atualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, senha, role, municipio } = req.body;
        const usuarioLogado = req.usuario;

        const isAdmin = usuarioLogado.role === 'admin';
        const isOwner = usuarioLogado.id === parseInt(id);

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para editar este usuário.' });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (isAdmin) {
            if (role) usuario.role = role;
            if (municipio) usuario.municipio = municipio;
        }

        if (email) usuario.email = email;
        if (senha) {
            const salt = await bcrypt.genSalt(12);
            usuario.senhaHash = await bcrypt.hash(senha, salt);
        }

        await usuario.save();
        res.status(200).json({ msg: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao atualizar o usuário.' });
    }
};

exports.deletarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const excluido = await Usuario.destroy({ where: { usuario_id: id } });

        if (excluido) {
            res.status(200).json({ msg: 'Usuário deletado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao deletar o usuário.' });
    }
};

exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogado = req.usuario;

        const isAdmin = usuarioLogado.role === 'admin';
        const isEstadual = usuarioLogado.role === 'estadual';
        const isOwner = usuarioLogado.id === parseInt(id);

        if (!isAdmin && !isEstadual && !isOwner) {
            return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para ver este usuário.' });
        }

        const usuario = await Usuario.findByPk(id, {
            attributes: ['usuario_id', 'email', 'role', 'municipio']
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno ao buscar o usuário.' });
    }
};