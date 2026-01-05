const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE'; 

async function autenticarVoluntario(email, senhaPura) {
    try {
        // Busca o voluntário pelo e-mail
        const [rows] = await pool.execute('SELECT * FROM VOLUNTARIO WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return { erro: "E-mail ou senha incorretos." };
        }

        const voluntario = rows[0];

        // Comparação de senha (ajuste se estiver usando Bcrypt, aqui está direta para teste)
        if (senhaPura !== voluntario.senha) {
            return { erro: "E-mail ou senha incorretos." };
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { id_voluntario: voluntario.id_voluntario, nivel: voluntario.nivel_acesso },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { 
            token, 
            nivel: voluntario.nivel_acesso,
            nome: voluntario.nome 
        };
    } catch (error) {
        console.error("Erro no Service de Autenticação:", error);
        throw error;
    }
}

async function cadastrarVoluntario(dados) {
    const { nome, email, senhaPura, nivelAcesso } = dados;
    try {
        const [result] = await pool.execute(
            'INSERT INTO VOLUNTARIO (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)',
            [nome, email, senhaPura, nivelAcesso || 'Comum']
        );
        return { mensagem: "Voluntário cadastrado!", id: result.insertId };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return { erro: "Este e-mail já está cadastrado." };
        throw error;
    }
}

module.exports = { autenticarVoluntario, cadastrarVoluntario };