const pool = require('../config/db');

async function cadastrarBeneficiario(dados) {
    const { nome_responsavel, cpf_responsavel, endereco, telefone, qtd_membros, status } = dados;
    const [result] = await pool.execute(
        'INSERT INTO BENEFICIARIO (nome_responsavel, cpf_responsavel, endereco, telefone, qtd_membros, status) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_responsavel, cpf_responsavel, endereco, telefone, qtd_membros, status]
    );
    return { mensagem: "Cadastrado com sucesso!", id: result.insertId };
}

async function listarBeneficiarios() {
    const [rows] = await pool.execute('SELECT * FROM BENEFICIARIO ORDER BY nome_responsavel ASC');
    return rows;
}

async function atualizarBeneficiario(cpf, dados) {
    const { nome_responsavel, endereco, telefone, qtd_membros, status } = dados;
    await pool.execute(
        'UPDATE BENEFICIARIO SET nome_responsavel = ?, endereco = ?, telefone = ?, qtd_membros = ?, status = ? WHERE cpf_responsavel = ?',
        [nome_responsavel, endereco, telefone, qtd_membros, status, cpf]
    );
    return { mensagem: "Dados atualizados com sucesso!" };
}

async function deletarBeneficiario(cpf) {
    await pool.execute('DELETE FROM BENEFICIARIO WHERE cpf_responsavel = ?', [cpf]);
    return { mensagem: "Beneficiário removido com sucesso!" };
}

module.exports = { 
    cadastrarBeneficiario, 
    listarBeneficiarios, 
    atualizarBeneficiario, 
    deletarBeneficiario 
};