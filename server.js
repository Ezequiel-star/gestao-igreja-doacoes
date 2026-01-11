const express = require('express');
const cors = require('cors');
const path = require('path');
const appRoutes = require('./src/routes/appRoutes');

const app = express();
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(__dirname));

app.use('/api', appRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'login3.html'));
});

app.listen(3000, () => {
    console.log(`🚀 SERVIDOR ATIVO EM: https://gestao-igreja-doacoes.onrender.com`);
});


