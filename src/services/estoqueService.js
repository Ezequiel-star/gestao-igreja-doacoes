const pool = require('../config/db');

async function listarEstoqueAtual() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [estoque] = await connection.execute(`
            SELECT id_doacao, tipo_item, quantidade, origem, data_validade 
            FROM doacao 
            WHERE quantidade > 0 
            ORDER BY data_validade ASC, tipo_item ASC
        `);
        return estoque;
    } catch (error) {
        console.error("Erro no Service ao listar estoque:", error);
        return { error: "Erro ao buscar dados de estoque." };
    } finally {
        if (connection) connection.release();
    }
}

async function registrarEstoque(dados) {
    // No seu modelo, doações alimentam o estoque automaticamente
    return { mensagem: "O estoque é atualizado via entrada de doações." };
}

module.exports = { listarEstoqueAtual, registrarEstoque };