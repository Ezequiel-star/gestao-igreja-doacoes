const pool = require('../config/db');

async function registrarDoacao(dados, idVoluntario) {
    try {
        const { tipo_item, quantidade, origem, data_validade } = dados;
        const query = `
            INSERT INTO DOACAO (id_voluntario, data_registro, tipo_item, quantidade, origem, data_validade)
            VALUES (?, CURDATE(), ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            idVoluntario,
            tipo_item,
            quantidade,
            origem || 'Anônimo',
            data_validade || null
        ]);
        return { mensagem: "✅ Doação registrada com sucesso!", id: result.insertId };
    } catch (error) {
        throw error;
    }
}

async function listarDoacoes() {
    try {
        const [rows] = await pool.execute('SELECT * FROM DOACAO ORDER BY data_registro DESC');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function consultarSaldoEstoque() {
    try {
        const query = `
            SELECT 
                tipo_item, 
                SUM(quantidade) as total_entrada,
                (SELECT IFNULL(SUM(quantidade_entregue), 0) 
                 FROM ITEM_ENTREGUE ie 
                 JOIN DOACAO d2 ON ie.id_doacao = d2.id_doacao 
                 WHERE d2.tipo_item = DOACAO.tipo_item) as total_saida,
                (SUM(quantidade) - (
                    SELECT IFNULL(SUM(quantidade_entregue), 0) 
                    FROM ITEM_ENTREGUE ie 
                    JOIN DOACAO d2 ON ie.id_doacao = d2.id_doacao 
                    WHERE d2.tipo_item = DOACAO.tipo_item
                )) as saldo_atual
            FROM DOACAO
            GROUP BY tipo_item
        `;
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { registrarDoacao, listarDoacoes, consultarSaldoEstoque };