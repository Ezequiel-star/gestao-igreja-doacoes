const pool = require('../config/db');

async function listarEntregas() {
    try {
        const query = `
            SELECT 
                e.id_entrega, 
                DATE_FORMAT(e.data_entrega, '%d/%m/%Y') AS data_entrega, 
                b.nome_responsavel AS nome_beneficiario,
                d.tipo_item, 
                ie.quantidade_entregue
            FROM ITEM_ENTREGUE ie
            JOIN ENTREGA e ON ie.id_entrega = e.id_entrega
            JOIN BENEFICIARIO b ON e.cpf_beneficiario = b.cpf_responsavel
            JOIN DOACAO d ON ie.id_doacao = d.id_doacao
            ORDER BY e.id_entrega DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        console.error("Erro no Service ao listar:", error.message);
        throw error;
    }
}

async function registrarEntrega(dados, idVoluntarioLogado) {
    const connection = await pool.getConnection();
    try {
        // Validação para evitar o erro de "undefined reading 0"
        if (!dados.itens_entregues || !dados.itens_entregues[0]) {
            throw new Error("Nenhum item foi enviado para a entrega.");
        }

        await connection.beginTransaction();

        const voluntarioId = idVoluntarioLogado || 1;

        // 1. Grava na tabela ENTREGA
        const [resEntrega] = await connection.execute(
            'INSERT INTO ENTREGA (cpf_beneficiario, data_entrega, id_voluntario) VALUES (?, CURDATE(), ?)',
            [dados.cpf_beneficiario, voluntarioId]
        );
        
        const idEntrega = resEntrega.insertId;
        const item = dados.itens_entregues[0]; // Agora com validação acima

        // 2. Grava na tabela ITEM_ENTREGUE
        await connection.execute(
            'INSERT INTO ITEM_ENTREGUE (id_entrega, id_doacao, quantidade_entregue) VALUES (?, ?, ?)',
            [idEntrega, item.id_doacao, item.quantidade_entregue]
        );

        // 3. Baixa automática no estoque (O UPDATE que você precisava)
        await connection.execute(
            'UPDATE DOACAO SET quantidade = quantidade - ? WHERE id_doacao = ?',
            [item.quantidade_entregue, item.id_doacao]
        );

        await connection.commit();
        return { sucesso: true };
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("ERRO NO BANCO:", error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function excluirEntrega(id) {
    try {
        await pool.execute('DELETE FROM ITEM_ENTREGUE WHERE id_entrega = ?', [id]);
        await pool.execute('DELETE FROM ENTREGA WHERE id_entrega = ?', [id]);
        return { sucesso: true };
    } catch (error) {
        throw error;
    }
}

module.exports = { listarEntregas, excluirEntrega, registrarEntrega };