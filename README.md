# physical-store-backend

API para gerenciamento de lojas físicas, permitindo operações CRUD e busca de lojas próximas.

## Tecnologias

- **Node.js**: ambiente de execução.
- **Express**:  facilita a criação de rotas organizadas e moduladas para cada operação de CRUD
- **PostgreSQL**: banco de dados para armazenamento das informações das lojas.
- **Axios**: biblioteca para realizar requisições HTTP externas.
- **dotenv**: para gerenciamento de variáveis de ambiente.
- **Winston**: para criação de logs personalizados.

## Endpoints

### 1. Criar uma Loja

- **Rota**: `/create`
- **Método**: `POST`
- **Descrição**: Cria uma nova loja.
- **Requisição**:
  ```json
```markdown

  {
    "nome": "Nome da Loja",
    "endereco": {
      "logradouro": "Rua Exemplo",
      "bairro": "Centro",
      "cidade": "Cidade Exemplo",
      "estado": "EX",
      "numero": "123",
      "cep": "12345678"
    },
    "telefone": "1234567890",
    "coordenadas": {
      "latitude": -23.5505,
      "longitude": -46.6333
    }
  }
  ```
- **Resposta de Sucesso**: `201 Created`
  ```json
  {
    "message": "Loja criada com sucesso"
  }
  ```

### 2. Atualizar Loja

- **Rota**: `/:id`
- **Método**: `PUT`
- **Descrição**: Atualiza as informações de uma loja.
- **Parâmetro**: `id` - ID da loja a ser atualizada.
- **Requisição**:
  ```json
  {
    "nome": "Novo Nome da Loja",
    "endereco": {
      "logradouro": "Nova Rua",
      "bairro": "Novo Bairro",
      "cidade": "Nova Cidade",
      "estado": "EX",
      "numero": "456",
      "cep": "87654321"
    },
    "telefone": "0987654321",
    "coordenadas": {
      "latitude": -22.0000,
      "longitude": -47.0000
    }
  }
  ```
- **Resposta de Sucesso**: `200 OK`
  ```json
  {
    "message": "Loja atualizada com sucesso"
  }
  ```

### 3. Buscar Lojas Próximas

- **Rota**: `/searchStore`
- **Método**: `GET`
- **Descrição**: Retorna uma lista de lojas próximas com base no CEP.
- **Requisição**:
  ```json
  {
    "endereco": {
      "cep": "12345678"
    }
  }
  ```
- **Resposta de Sucesso**: `200 OK`
  ```json
  {
    "lojasProximas": [
      {
        "Distancia": "XKM",
        "nome": "Loja A",
        "endereco": {
          "logradouro": "Rua A",
          "bairro": "Bairro A",
          "cidade": "Cidade A",
          "estado": "EX",
          "numero": "111",
          "cep": "12345678"
        },
        "telefone": "1234567890"
      }
    ]
  }
  ```

### 4. Apagar Loja

- **Rota**: `/:id`
- **Método**: `DELETE`
- **Descrição**: Exclui uma loja do banco de dados.
- **Parâmetro**: `id` - ID da loja a ser excluída.
- **Resposta de Sucesso**: `200 OK`
  ```json
  {
    "message": "Loja apagada com sucesso"
  }
  ```

## Configuração do Banco de Dados

O banco de dados PostgreSQL é configurado por meio de variáveis de ambiente:

- `DB_HOST`: host do banco de dados.
- `DB_USER`: usuário do banco.
- `DB_PASS`: senha do banco.
- `DB_NAME`: nome do banco.
- `DB_PORT`: porta do banco de dados (por exemplo, `5432`).

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` com as variáveis de ambiente para o banco de dados e a chave da API do Google Maps:
   ```
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASS=senha
   DB_NAME=nome_do_banco
   DB_PORT=5432
   GOOGLE_API_KEY=sua_google_api_key
   ```

3. Execute a aplicação:
   ```bash
   npm start || npm rum dev
   ```

4. A API estará disponível em `http://localhost:5000`.

## Estrutura do Projeto

- **controllers**: contém os controladores das rotas.
- **db**: configuração do banco de dados PostgreSQL.
- **models**: definição de modelos e funções relacionadas ao banco.
- **routes**: definição das rotas da aplicação.
- **services**: serviços de negócio para criação, atualização, busca e exclusão de lojas.
- **utils**: utilitários, incluindo loggers para monitoramento de erros e informações.
- **index**: inicia a api e Configuração principal do Express
````
physical-store-backend/
  ├── bakend/
  │   ├── controllers/
  │   │   └── storeController.ts                        # Controlador para as operações de loja
  │   ├── db/
  │   │   └── database.ts                               # Configuração do banco de dados PostgreSQL
  │   ├── models/
  │   │   └── storeModel.ts                             # Definição do modelo de Loja e operações com o banco
  │   ├── routes/
  │   │   └── storeRoutes.ts                            # Definição das rotas de loja
  │   ├── services/
  │   │   ├── storeServices/
  │   │   │   ├── createStoreService.ts                 # Serviço para criação de lojas
  │   │   │   ├── deleteStoreService.ts                 # Serviço para exclusão de lojas
  │   │   │   ├── searchNearbyStoreService.ts           # Serviço para busca de lojas próximas por CEP
  │   │   │   └── updateStoreService.ts                 # Serviço para atualização de lojas
  │   │   ├── converterCep.ts                           # Serviço para conversão de CEP
  │   │   └── searchAddressCep.ts                       # Serviço para busca de endereço pelo CEP
  │   ├── utils/
  │   │   ├── logger.ts                                 # Configuração do Winston para logs
  │   │   └── calculateDistance.ts                      # Função para calcular a distância entre CEPs
  │   ├── index.ts                                      # Configuração principal do Express
  ├── .env                                              # Variáveis de ambiente
  ├── .gitignore                                        # Arquivos e pastas para ignorar no Git
  ├── package.json                                      # Dependências e scripts do projeto
  ├── package-lock.json                                 # Controle de versão exata das dependências instaladas
  └── tsconfig.json                                     # Configurações do TypeScript para o projeto

````


## Logs

A API utiliza Winston para geração de logs de erros, informações e alertas. Todos os logs ficam no terminal para facilitar o monitoramento durante o desenvolvimento e execução.

## Erros Comuns

- `CEP inválido`: Certifique-se de que o campo `cep` possui 8 dígitos numéricos.
- `Nome inválido`: O campo `nome` é obrigatório para criação de uma loja.
- `Conexão ao banco de dados`: Verifique as variáveis de ambiente para o banco e o estado do servidor de banco de dados.

```
