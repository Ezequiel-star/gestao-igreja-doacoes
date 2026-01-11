const pool = require('../config/db'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// Mantenha esta chave igual ao seu authMiddleware.js
const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE'; 

async function registerVoluntario(dados) {
    const { nome, email, senhaPura } = dados;
    try {
        const [existente] = await pool.execute(
            'SELECT id_voluntario FROM VOLUNTARIO WHERE email = ?', 
            [email]
        );
        if (existente.length > 0) return { error: "Este e-mail já está cadastrado." };

        // CRIPTOGRAFIA: Protegendo a senha antes de salvar na Aiven
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senhaPura, salt);

        const query = 'INSERT INTO VOLUNTARIO (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)';
        const values = [nome, email, senhaHash, 'Comum']; 

        await pool.execute(query, values);
        return { sucesso: true };
    } catch (error) {
        console.error("❌ Erro no Registro:", error.message);
        throw error; 
    }
}

async function authenticateVoluntario(email, senhaPura) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_voluntario, nome, senha, nivel_acesso FROM VOLUNTARIO WHERE email = ?', 
            [email]
        );

        if (rows.length === 0) {
            return { error: 'Credenciais inválidas' };
        }

        const voluntario = rows[0];

        // COMPARAÇÃO SEGURA: Compara a senha digitada com o Hash do banco
        const senhaValida = await bcrypt.compare(senhaPura, voluntario.senha);
        
        // Mantive a opção de texto puro apenas para não te travar caso já existam usuários sem hash
        if (!senhaValida && senhaPura !== voluntario.senha) {
            return { error: 'Credenciais inválidas' };
        }

        // TOKEN: Agora com ID padronizado para o restante do sistema
        const token = jwt.sign(
            { 
                id: voluntario.id_voluntario, // Usando 'id' para bater com o controller
                nome: voluntario.nome,
                nivel: voluntario.nivel_acesso 
            },
            JWT_SECRET,
            { expiresIn: '24h' } 
        );

        console.log("✅ Login realizado com sucesso para:", email);
        return { token, nivel: voluntario.nivel_acesso, nome: voluntario.nome };

    } catch (error) {
        console.error("❌ ERRO NO LOGIN:", error); 
        return { error: "Erro interno no processo de login." };
    }
}

module.exports = { authenticateVoluntario, registerVoluntario };