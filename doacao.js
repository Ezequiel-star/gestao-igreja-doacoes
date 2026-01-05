async function confirmarEntrada(event) {
    if (event) event.preventDefault(); 

    const token = localStorage.getItem('token'); 
    if (!token) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = 'login3.html';
        return;
    }

    // Captura dos dados do formulário
    const dados = {
        origem: document.getElementById('origem').value,
        tipo_item: document.getElementById('tipo_item').value,
        quantidade: parseFloat(document.getElementById('quantidade').value),
        data_validade: document.getElementById('validade')?.value || null
    };

    try {
        const response = await fetch('http://localhost:3000/api/doacao/registrar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert("✅ Sucesso: " + (resultado.mensagem || "Doação registrada!"));
            document.getElementById('doacaoForm').reset();
        } else {
            alert("❌ Erro: " + (resultado.erro || "Falha no registro"));
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Não foi possível conectar ao servidor. Verifique se o terminal está rodando o Node.js.");
    }
}

// Inicialização do evento
const formDoacao = document.getElementById('doacaoForm');
if (formDoacao) {
    formDoacao.addEventListener('submit', confirmarEntrada);
}