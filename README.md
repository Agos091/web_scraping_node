# Teste Neogrid Web Scraper com Node.js e React

Este projeto é uma aplicação web que permite ao usuário realizar scraping de produtos do site Netshoes. A aplicação é composta por um backend em Node.js que utiliza Puppeteer para realizar o scraping e um frontend em React para exibir os resultados. Como descrito, a aplicação retorna (título, preço, imagem, descrição) e permite ao usuário inserir o número de produtos que deseja buscar. Além disso, há uma interface frontend que oferece melhor visibilidade dos resultados e da aplicação.

## Estrutura do Projeto

TesteNeogrid/
├── backend/
│ ├── node_modules/
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
├── web-scraper-app/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ └── App.js
│ ├── package.json
│ └── package-lock.json

## Funcionalidades

- Permite ao usuário inserir um termo de busca.
- Permite ao usuário definir o número de produtos a serem buscados.
- Realiza scraping dos produtos do site Netshoes.
- Exibe os resultados do scraping no frontend React.

## Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)

## Como Executar

### Passo 1: Configurar o Backend

1. Navegue até a pasta `backend`:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor backend:

   ```bash
   node index.js
   ```

### Passo 2: Configurar o Frontend

1. Navegue até a pasta `web-scraper-app`:

   ```bash
   cd ../web-scraper-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor frontend:

   ```bash
   npm start
   ```

### Passo 3: Acessar a Aplicação

1. Abra o navegador e acesse `http://localhost:3000`.
2. Insira o termo de busca e o número de produtos que deseja buscar.
3. Clique em "Buscar" e veja os resultados do scraping exibidos na tela.

## Estrutura do Código

### Backend (`backend/index.js`)

- Configura um servidor Express.
- Utiliza Puppeteer para realizar o scraping dos produtos.
- Define uma rota `/scrape` que recebe um termo de busca e um número de produtos, realiza o scraping e retorna os resultados.

### Frontend (`web-scraper-app/src/App.js`)

- Configura uma interface React.
- Permite ao usuário inserir um termo de busca e um número de produtos.
- Envia uma solicitação ao backend para realizar o scraping.
- Exibe os resultados do scraping na interface.

## Possíveis Erros

- **ERR_CONNECTION_REFUSED:** Certifique-se de que o servidor backend está em execução na porta 5000.
- **ERRO AO REALIZAR SCRAPING:** Verifique se o seletor utilizado no Puppeteer está correto e se a página do Netshoes não mudou a estrutura.

## Autor

Nome: Agos Dalcin Rufino  
GitHub: [https://github.com/Agos091](https://github.com/Agos091)  
LinkedIn: [https://www.linkedin.com/in/agos-dalcin-rufino-a9913821a/](https://www.linkedin.com/in/agos-dalcin-rufino-a9913821a/)

## Observações

Certifique-se de que as portas usadas no código (5000 para o backend e 3000 para o frontend) não estão em uso por outros serviços.
Se você precisar ajustar a porta para o backend ou frontend, lembre-se de atualizar os URLs correspondentes no código do frontend (`src/App.js`).

O limite de busca é 42 itens.
Vesão usada do Node: (v20.15.0).
Vesão usada do Puppeteer: (^22.13.0).
Vesão usada do React: (^18.3.1).
Vesão usada do Axios: (^1.7.2).

Obrigado pela oportunidade.  
Att, Agos Dalcin Rufino
