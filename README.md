# 🤝Sistema Gerenciador de Doações

Sistema gerenciador de doações desenvolvido para auxiliar no controle, organização e distribuição de doações destinadas a municípios e pessoas em situação de vulnerabilidade. A plataforma permite que usuários realizem solicitações de kits/doações e que administradores responsáveis realizem a aprovação ou rejeição das solicitações, além do gerenciamento do estoque de produtos e kits.


# 📌 Objetivo do Projeto

O projeto foi desenvolvido com o objetivo de facilitar o gerenciamento de doações, proporcionando maior organização no controle de produtos, kits e solicitações, além de otimizar o processo de distribuição dos recursos.

---

# 🚀 Tecnologias Utilizadas

## Backend
- Node.js
- Express
- Sequelize
- MySQL
- JWT
- bcrypt
- Docker

## Frontend
- Angular
- TypeScript
- HTML
- CSS

## Infraestrutura
- Docker
- Docker Compose

---

# Desenvolvimento por Sprints

# 🔵 Sprint 1 – Levantamento de Requisitos e Prototipação
📅 06/05/2026 → 20/05/2026

## ⚙️ Principais atividades
- levantamento dos requisitos funcionais e não funcionais
- modelagem inicial do banco de dados 
- criação dos protótipos das telas
## 📦 Resultados

- Documento de requisitos: https://docs.google.com/document/d/1PCCNhKwN1NhGhPGWRK-PWDxkCaOavRvBhEeDmvE30yA/edit?usp=sharing
- link do prototipo figma: [Sistema de doações](https://www.figma.com/proto/DU7ac0e0uTlp9YXAx1pXWQ/sistema-de-doa%C3%A7%C3%B5es?node-id=468-64&p=f&t=aW61tJIjFLzk0ZEf-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1)

- Modelagem Banco de dados
- Diagrama Relacional do Banco de dados: 
[Sistema de doações](https://docs.google.com/document/d/1wrJ60wO4uT-JDGGaSTrLlKZ35sirrltfxIV8H0goedA/edit?usp=sharing)
<img width="320" height="224" alt="image" src="https://github.com/user-attachments/assets/640dee07-4689-45c7-945d-42c0e9c7ba09" />

# 🔵 Sprint 2 – Configurações iniciais e Módulo de usuários
📅 21/05/2026 → 03/06/2026
## ⚙️ Principais atividades
- Construir a estrutura inicial do sistema
- implementar o módulo de autenticação de usuários. 
## 📦 Resultados
- Configuração do Banco de dados
- Configuração do Docker
- Implementação do Módulo de usuários
- Criação da tela de login e recuperação de senha

# 🔵 Sprint 3 – Módulo de gerenciamento de estoque(Produtos e Kits)
📅 04/06/2026 → 17/06/2026
## ⚙️ Principais atividades
- Criação do CRUD de Produtos
- Criação do CRUD de Kits
- Telas de Gerenciamento de Estoque
## 📦 Resultados
- Conclusão do Módulo de gerenciamento de estoque (Produtos e Kits)

# 🔵 Sprint 4 – Módulo de Solicitações Kit e Saida Produtos
📅 18/06/2026 → 26/06/2026
## ⚙️ Principais atividades
- Implementação do módulo de solicitações e saida Kits
## 📦 Resultados
-  Implementação do módulo de solicitação
-  Implementação de rastreio para saída dos Kits
-  Telas de solicitações
-  Integração do Backend com o Frontend

## 🚀 Como Executar o Projeto 

### 1\. Requisitos do Sistema

Para garantir o correto funcionamento do ambiente de desenvolvimento, são necessários:

  * **Docker Desktop:** Essencial para a construção e gerenciamento dos containers, fornecendo a plataforma Docker e o Docker Compose.
  * **Git:** Recomendado para clonar o repositório e utilizar a linha de comando.

### 2\. Preparação e Configuração

**2.1. Obtenção do Código-Fonte:**
Você tem duas opções para obter o código:

  * **Opção A: Clonar via Git (Recomendado):**
    Abra seu terminal (**Git Bash**, terminal Linux/macOS, ou PowerShell) e execute o comando:

    ```bash
    git clone https://github.com/Rebecavitoria45/Projeto-Processos-Ageis.git
    ```

    Em seguida, entre na pasta raiz do projeto:

    ```bash
    cd SistemaGerenciadorDoacoes
    ```

  * **Opção B: Download Direto:**
    Baixe o projeto como um arquivo ZIP diretamente do GitHub e extraia-o. Após a extração, abra seu terminal na pasta raiz do projeto (`SistemaGerenciadorDoacoes`).

**2.2. Criação e Configuração do Arquivo `.env`:**
Crie o arquivo **`.env`** na raiz do projeto e preencha as variáveis, como as credenciais do banco de dados (`DB_NAME`, `DB_USER`, `DB_PASSWORD`), a **chave secreta (`SECRET`)**, e as credenciais de e-mail para testes.

> **Importante:** A **`FRONTEND_ACTIVATION_URL`** deve ser definida com o endereço de teste local: `http://localhost:4200/definir`.

### 3\. Inicialização e Acesso

Com o Docker Desktop em execução e seu terminal posicionado na pasta raiz (`SistemaGerenciadorDoacoes`), execute o comando Docker Compose. Ele se encarregará de construir as imagens, instalar todas as dependências (Node.js e Angular via `npm install`) e iniciar os serviços, garantindo que o Backend aguarde o Banco de Dados.

```bash
docker-compose up --build -d
```

Após a inicialização, a aplicação estará acessível internamente:

  * **Acesso ao Frontend:** `http://localhost:4200`
  * **Acesso ao Backend (Swagger):** `http://localhost:3000/api-docs/`
  * **Porta do Banco de Dados:** `3307` (mapeada para a porta interna 3306)
-----
  

  

