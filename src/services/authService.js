const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');
// Importe o bcrypt mesmo que não use agora, para evitar erros de referência
const bcrypt = require('bcrypt'); 

const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE'; 

async function registerVoluntario(dados) {
    const { nome, email, senhaPura } = dados;
    try {
        const [existente] = await pool.execute(
            'SELECT id_voluntario FROM voluntario WHERE email = ?', 
            [email]
        );
        if (existente.length > 0) return { error: "Este e-mail já está cadastrado." };

        const query = 'INSERT INTO voluntario (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)';
        const values = [nome, email, senhaPura, 'Comum']; 

        await pool.execute(query, values);
        return { sucesso: true };
    } catch (error) {
        console.error("❌ Erro no Registro:", error.message);
        throw error; 
    }
}

async function authenticateVoluntario(email, senhaPura) {
    try {
        // 1. Busca o usuário
        const [rows] = await pool.execute(
            'SELECT id_voluntario, senha, nivel_acesso FROM voluntario WHERE email = ?', 
            [email]
        );

        if (rows.length === 0) {
            return { error: 'Credenciais inválidas' };
        }

        const voluntario = rows[0];

        // 2. Comparação (Garantindo que ambos sejam strings para evitar erro 401)
        if (String(senhaPura) !== String(voluntario.senha)) {
            console.log("⚠️ Senha não confere");
            return { error: 'Credenciais inválidas' };
        }

        // 3. Geração do Token
        const token = jwt.sign(
            { id_voluntario: voluntario.id_voluntario, nivel: voluntario.nivel_acesso },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("✅ Login realizado com sucesso!");
        return { token, nivel: voluntario.nivel_acesso };

    } catch (error) {
        // ESTA LINHA VAI MOSTRAR O ERRO REAL NO SEU TERMINAL
        console.error("❌ ERRO REAL NO LOGIN:", error); 
        return { error: "Erro interno no processo de login." };
    }
}

module.exports = { authenticateVoluntario, registerVoluntario };