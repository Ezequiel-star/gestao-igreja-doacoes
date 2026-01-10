require('dotenv').config(); // Carrega as variáveis do seu arquivo .env
const mysql = require('mysql2/promise');

// 1. Configuração que lê os dados do seu arquivo .env
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    ssl: {
        rejectUnauthorized: false // Obrigatório para conectar na Aiven
    }
};

// 2. Criação do Pool de Conexões
const pool = mysql.createPool(dbConfig);

// 3. Teste automático de conexão para te ajudar no terminal
pool.getConnection()
    .then(connection => {
        console.log("✅ CONECTADO COM SUCESSO À AIVEN!");
        connection.release();
    })
    .catch(error => {
        console.error("❌ ERRO NA CONEXÃO:", error.message);
    });

module.exports = pool;