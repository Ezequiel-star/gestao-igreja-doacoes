
// src/config/db.js (CORREÇÃO E TESTE DE CONEXÃO)

const mysql = require('mysql2/promise');

// 1. Defina suas credenciais de acesso
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    // **SUA SENHA CORRETA AQUI** (Mesma que funciona no Workbench)
    password: "12345678", 
    database: "igreja", 
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// 2. Criação do Pool de Conexões
const pool = mysql.createPool(dbConfig);

// 3. TESTE DE CONEXÃO: Tenta pegar uma conexão e retorna (se falhar, o erro aparecerá)
pool.getConnection()
    .then(connection => {
        console.log("✅ Conexão com o MySQL estabelecida com sucesso!");
        connection.release(); // Libera a conexão
    })
    .catch(error => {
        // Se a senha estiver errada, o erro aparecerá AQUI no terminal:
        console.error("❌ ERRO FATAL AO CONECTAR COM O MYSQL:", error.message);
        // Garante que o Node não continue rodando com uma conexão quebrada
        process.exit(1); 
    });


// 4. Exporta o pool para ser usado nos Services
module.exports = pool;