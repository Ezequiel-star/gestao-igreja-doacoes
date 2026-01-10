

-- 2. Tabela de Voluntários
CREATE TABLE VOLUNTARIO (
    id_voluntario INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso ENUM('Admin', 'Comum') NOT NULL DEFAULT 'Comum',
    PRIMARY KEY (id_voluntario)
);

-- 3. Tabela de Famílias (Beneficiários)
CREATE TABLE BENEFICIARIO (
    cpf_responsavel VARCHAR(14) NOT NULL,
    nome_responsavel VARCHAR(100) NOT NULL,
    endereco VARCHAR(255),
    telefone VARCHAR(15),
    qtd_membros INT NOT NULL DEFAULT 1,
    status ENUM('Aguardando Triagem', 'Ativo', 'Inativo') NOT NULL DEFAULT 'Aguardando Triagem',
    PRIMARY KEY (cpf_responsavel)
);

-- 4. Tabela de Doações (Estoque)
CREATE TABLE DOACAO (
    id_doacao INT NOT NULL AUTO_INCREMENT,
    id_voluntario INT NOT NULL,
    data_registro DATE NOT NULL,
    tipo_item VARCHAR(50) NOT NULL,
    quantidade DECIMAL(10, 2) NOT NULL,
    origem VARCHAR(100),
    data_validade DATE,
    PRIMARY KEY (id_doacao),
    FOREIGN KEY (id_voluntario) REFERENCES VOLUNTARIO(id_voluntario)
);

-- 5. Tabela de Entregas (Com regra de exclusão automática)
CREATE TABLE ENTREGA (
    id_entrega INT NOT NULL AUTO_INCREMENT,
    cpf_beneficiario VARCHAR(14) NOT NULL,
    id_voluntario INT NOT NULL,
    data_entrega DATE NOT NULL,
    observacoes TEXT,
    PRIMARY KEY (id_entrega),
    CONSTRAINT fk_entrega_beneficiario 
        FOREIGN KEY (cpf_beneficiario) REFERENCES BENEFICIARIO(cpf_responsavel) 
        ON DELETE CASCADE, -- Isso resolve o erro de exclusão!
    FOREIGN KEY (id_voluntario) REFERENCES VOLUNTARIO(id_voluntario)
);

-- 6. Tabela de Itens Entregues
CREATE TABLE ITEM_ENTREGUE (
    id_entrega INT NOT NULL,
    id_doacao INT NOT NULL,
    quantidade_entregue DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_entrega, id_doacao),
    CONSTRAINT fk_item_da_entrega 
        FOREIGN KEY (id_entrega) REFERENCES ENTREGA(id_entrega) 
        ON DELETE CASCADE,
    FOREIGN KEY (id_doacao) REFERENCES DOACAO(id_doacao)
);

-- 7. Inserção do usuário de teste
INSERT INTO VOLUNTARIO (nome, email, senha, nivel_acesso) 
VALUES ('Teste Manual', 'manual@teste.com', '123456', 'Admin');


-- Garante o beneficiário
INSERT INTO BENEFICIARIO (cpf_responsavel, nome_responsavel, status) 
VALUES ('111', 'Ezequiel Teste', 'Ativo')
ON DUPLICATE KEY UPDATE nome_responsavel = 'Ezequiel Teste';

-- Garante uma doação (ID 1)
REPLACE INTO DOACAO (id_doacao, id_voluntario, data_registro, tipo_item, quantidade) 
VALUES (1, 1, CURDATE(), 'Cesta Básica', 10);

-- Cria a entrega (ID 1)
REPLACE INTO ENTREGA (id_entrega, cpf_beneficiario, id_voluntario, data_entrega) 
VALUES (1, '111', 1, CURDATE());

-- Vincula o item à entrega (ID 1 com ID 1)
REPLACE INTO ITEM_ENTREGUE (id_entrega, id_doacao, quantidade_entregue) 
VALUES (1, 1, 1);



