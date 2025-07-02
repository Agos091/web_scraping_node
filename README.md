# 🔍 Web Scraping para Mineração de Texto

## 📋 Descrição

Este projeto apresenta um exemplo completo de **Web Scraping** que extrai dados de produtos da Netshoes e salva os resultados em formatos **CSV** e **TXT** para posterior análise e **Mineração de Texto**.

## 🎯 Funcionalidades

### ✨ Web Scraping Avançado
- 🛒 Extração de dados de produtos (título, preço, descrição, imagens)
- 🔗 Captura de URLs e metadados completos
- ⏰ Timestamp de extração para controle temporal
- 🧹 Limpeza e normalização automática de texto

### 💾 Exportação de Dados
- **📊 CSV**: Dados estruturados para análise em planilhas/bancos de dados
- **📝 TXT**: Texto limpo e otimizado para mineração de texto
- 🔄 Processamento automático com caracteres especiais removidos
- 📁 Organização por data e termo de busca

### 🖥️ Interface Moderna
- 🎨 Interface React responsiva e intuitiva
- 📊 Estatísticas em tempo real da extração
- 💾 Downloads diretos dos arquivos gerados
- 📂 Histórico completo de extrações anteriores

## 🛠️ Tecnologias Utilizadas

### Backend (Node.js)
- **Express.js**: Servidor web
- **Puppeteer**: Web scraping automatizado
- **csv-writer**: Geração de arquivos CSV
- **fs-extra**: Manipulação avançada de arquivos
- **moment**: Formatação de datas

### Frontend (React)
- **React**: Interface de usuário
- **Axios**: Requisições HTTP
- **CSS Grid/Flexbox**: Layout responsivo

## 📁 Estrutura do Projeto

```
web_scraping_node/
├── backend/
│   ├── index.js              # Servidor principal com web scraping
│   ├── package.json          # Dependências do backend
│   └── scraped_data/         # Diretório dos dados extraídos (gerado automaticamente)
│       ├── products_*.csv    # Arquivos CSV estruturados
│       └── products_text_*.txt # Arquivos TXT para mineração
├── web-scraper-app/
│   ├── src/
│   │   ├── App.js            # Componente principal React
│   │   ├── App.css           # Estilos modernos
│   │   └── card_podcts.js    # Componente de card de produto
│   └── package.json          # Dependências do frontend
└── README.md                 # Documentação
```

## 🚀 Como Executar

### 1️⃣ Pré-requisitos
```bash
# Node.js 16+ e Yarn
node --version
yarn --version
```

### 2️⃣ Instalação do Backend
```bash
cd backend
yarn install
```

### 3️⃣ Instalação do Frontend
```bash
cd ../web-scraper-app
yarn install
```

### 4️⃣ Executar o Sistema

**Terminal 1 - Backend:**
```bash
cd backend
eval "$(/opt/homebrew/bin/brew shellenv)" # macOS
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd web-scraper-app
yarn start
```

### 5️⃣ Acessar a Aplicação
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5001

## 📖 Como Usar

### 1. Realizar Extração
1. Digite um termo de busca (ex: "tênis", "camiseta")
2. Escolha quantos produtos extrair (máximo 20)
3. Clique em "🚀 Buscar"
4. Aguarde o processamento

### 2. Analisar Resultados
- ✅ Visualize o resumo da extração
- 👀 Confira os produtos encontrados
- 📊 Veja estatísticas em tempo real

### 3. Download dos Dados
- **💾 CSV**: Para análise em Excel/planilhas
- **💾 TXT**: Para mineração de texto/NLP

### 4. Histórico
- 📂 Acesse extrações anteriores
- 🔍 Filtre por data e tipo de arquivo
- ⬇️ Faça download de qualquer arquivo anterior

## 📊 Formato dos Dados

### CSV (Dados Estruturados)
```csv
ID,Título,Preço,Descrição,Texto Limpo,URL,URL da Imagem,Termo Pesquisado,Data/Hora da Extração
1,Tênis Nike Air Max,R$ 299.90,Tênis esportivo...,tenis nike air max esportivo...,https://...,https://...,tênis,2024-01-15T10:30:00Z
```

### TXT (Mineração de Texto)
```txt
# Dados extraídos para mineração de texto
# Termo pesquisado: tênis
# Data/Hora: 2024-01-15T10:30:00Z
# Total de produtos: 5

=== PRODUTO 1 ===
Título: Tênis Nike Air Max
Preço: R$ 299,90
Descrição: Tênis esportivo com tecnologia Air Max...
URL: https://www.netshoes.com.br/produto/123
Texto limpo para mineração: tenis nike air max esportivo tecnologia conforto

=== TEXTO LIMPO PARA MINERAÇÃO ===
tenis nike air max esportivo tecnologia conforto
sapato adidas running performance
...
```

## 🔍 Casos de Uso para Mineração de Texto

### 📈 Análise de Mercado
- **Tendências**: Identificar produtos mais populares
- **Preços**: Análise de faixas de preço por categoria
- **Marcas**: Frequência e posicionamento de marcas

### 🤖 Processamento de Linguagem Natural
- **Análise de Sentimento**: Avaliar descrições de produtos
- **Classificação**: Categorizar produtos automaticamente
- **Palavras-chave**: Extrair termos relevantes

### 📊 Business Intelligence
- **Dashboards**: Alimentar painéis de controle
- **Relatórios**: Gerar análises automáticas
- **Comparativos**: Estudos de concorrência

## 🔧 API Endpoints

### Scraping
```bash
POST /scrape
Content-Type: application/json
{
  "searchQuery": "tênis",
  "maxCount": 5
}
```

### Listar Arquivos
```bash
GET /files
```

### Download
```bash
GET /download/:filename
```

### Visualizar Conteúdo
```bash
GET /view/:filename
```

## 🎨 Características Técnicas

### 🧹 Limpeza de Texto
- Remove caracteres especiais
- Normaliza espaços
- Mantém acentuação portuguesa
- Converte para minúsculas

### ⚡ Performance
- Scraping assíncrono
- Interface responsiva
- Download otimizado
- Cache de arquivos

### 🔒 Robustez
- Tratamento de erros
- Validação de entrada
- Timeouts configuráveis
- Logs detalhados

## 📱 Responsividade

- 📱 **Mobile**: Layout adaptado para celulares
- 💻 **Desktop**: Interface completa
- 📐 **Tablet**: Otimizado para tablets

## 🔄 Próximas Melhorias

- [ ] 🔍 Múltiplos sites de scraping
- [ ] 📊 Gráficos e visualizações
- [ ] 🤖 Análise automática de sentimento
- [ ] 📧 Notificações por email
- [ ] 🗄️ Banco de dados
- [ ] 🔐 Autenticação de usuários

## 📝 Exemplo de Uso

```javascript
// Exemplo de requisição para scraping
const response = await fetch('http://localhost:5000/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    searchQuery: 'tênis nike',
    maxCount: 10
  })
});

const data = await response.json();
console.log('Produtos extraídos:', data.products.length);
console.log('Arquivos gerados:', data.files);
```

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor:

1. 🍴 Fork o projeto
2. 🌱 Crie sua feature branch
3. ✅ Commit suas mudanças
4. 📤 Push para a branch
5. 🔄 Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**💡 Dica**: Este projeto é ideal para estudantes e profissionais interessados em **web scraping**, **mineração de texto** e **análise de dados**!
