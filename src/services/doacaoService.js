const pool = require('../config/db');

async function registrarDoacao(dados, idVoluntario) {
    try {
        const { tipo_item, quantidade, origem, data_validade } = dados;
        const query = `
            INSERT INTO DOACAO (id_voluntario, data_registro, tipo_item, quantidade, origem, data_validade)
            VALUES (?, CURDATE(), ?, ?, ?, ?)
        `;
        // Garante que quantidade nunca seja negativa no registro
        const qtdSegura = quantidade < 0 ? 0 : quantidade;

        const [result] = await pool.execute(query, [
            idVoluntario,
            tipo_item,
            qtdSegura,
            origem || 'Anônimo',
            data_validade || null
        ]);
        return { mensagem: "✅ Doação registrada com sucesso!", id: result.insertId };
    } catch (error) {
        throw error;
    }
}

async function consultarSaldoEstoque() {
    try {
        // Query melhorada para performance
        const query = `
            SELECT 
                tipo_item, 
                SUM(quantidade) as total_entrada,
                (SELECT IFNULL(SUM(ie.quantidade_entregue), 0) 
                 FROM ITEM_ENTREGUE ie 
                 JOIN DOACAO d2 ON ie.id_doacao = d2.id_doacao 
                 WHERE d2.tipo_item = DOACAO.tipo_item) as total_saida,
                (SUM(quantidade) - (
                    SELECT IFNULL(SUM(ie.quantidade_entregue), 0) 
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

module.exports = { registrarDoacao, listarDoacoes: (require('./doacaoService')).listarDoacoes, consultarSaldoEstoque };