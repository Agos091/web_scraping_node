const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Diretório para armazenar os dados extraídos
const DATA_DIR = path.join(__dirname, 'scraped_data');

// Garante que o diretório existe
fs.ensureDirSync(DATA_DIR);

class ProductScraper {
  constructor(url, searchQuery, maxCount) {
    this.url = url;
    this.searchQuery = searchQuery;
    this.maxCount = maxCount;
    this.browser = null;
    this.page = null;
    this.timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  }

  async initialize() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    console.log("Navegador inicializado");
  }

  async searchProducts() {
    await this.page.goto(this.url);
    console.log("Achou Produto");

    await this.page.waitForSelector("#search");
    await this.page.type("#search", this.searchQuery);

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(".search__button"),
    ]);

    console.log("Busca realizada");
  }

  async getProductLinks() {
    const links = await this.page.$$eval(".card a", (elements) =>
      elements.map((link) => "https://www.netshoes.com.br/" + link.href)
    );
    return links.slice(0, this.maxCount);
  }

  async getProductDetails(link, c) {
    console.log("pagina", c);
    await this.page.goto(link);
    await this.page.waitForSelector(".product-name");

    const title = await this.page.evaluate(() => {
      const tl = document.querySelector(".product-name");
      if (!tl) return "Titulo do item não foi encontrado";
      return tl.innerText;
    });

    const price = await this.page.evaluate(() => {
      const pc = document.querySelector(".saleInCents-value");
      if (!pc) return "Preço do item não foi econtrado";
      return pc.innerText;
    });

    const imageUrl = await this.page.evaluate(() => {
      const im = document.querySelector(".showcase figure > img");
      if (!im) return "Imagem do item não foi encontrado";
      return im.src;
    });

    const description = await this.page.evaluate(() => {
      const dc = document.querySelector(".showcase-details");
      if (!dc) return "Descrição do item não foi encontrada";
      return dc.innerText;
    });

    // Extrai texto limpo para mineração
    const cleanText = this.extractCleanText(title, description);

    return { 
      id: c,
      title, 
      price, 
      imageUrl, 
      description,
      cleanText,
      url: link,
      scrapedAt: new Date().toISOString(),
      searchQuery: this.searchQuery
    };
  }

  extractCleanText(title, description) {
    // Remove caracteres especiais e normaliza o texto para mineração
    const combined = `${title} ${description}`;
    return combined
      .replace(/[^\w\sáâãàéêíóôõúç]/gi, ' ') // Remove caracteres especiais, mantém acentos
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .trim()
      .toLowerCase();
  }

  async saveToCSV(data) {
    const csvFilename = `products_${this.searchQuery.replace(/\s+/g, '_')}_${this.timestamp}.csv`;
    const csvPath = path.join(DATA_DIR, csvFilename);

    const csvWriter = createCsvWriter({
      path: csvPath,
      header: [
        {id: 'id', title: 'ID'},
        {id: 'title', title: 'Título'},
        {id: 'price', title: 'Preço'},
        {id: 'description', title: 'Descrição'},
        {id: 'cleanText', title: 'Texto Limpo'},
        {id: 'url', title: 'URL'},
        {id: 'imageUrl', title: 'URL da Imagem'},
        {id: 'searchQuery', title: 'Termo Pesquisado'},
        {id: 'scrapedAt', title: 'Data/Hora da Extração'}
      ]
    });

    await csvWriter.writeRecords(data);
    console.log(`Dados salvos em CSV: ${csvPath}`);
    return csvFilename;
  }

  async saveToTXT(data) {
    const txtFilename = `products_text_${this.searchQuery.replace(/\s+/g, '_')}_${this.timestamp}.txt`;
    const txtPath = path.join(DATA_DIR, txtFilename);

    // Cria arquivo TXT otimizado para mineração de texto
    let textContent = `# Dados extraídos para mineração de texto\n`;
    textContent += `# Termo pesquisado: ${this.searchQuery}\n`;
    textContent += `# Data/Hora: ${new Date().toISOString()}\n`;
    textContent += `# Total de produtos: ${data.length}\n\n`;

    data.forEach((product, index) => {
      textContent += `=== PRODUTO ${index + 1} ===\n`;
      textContent += `Título: ${product.title}\n`;
      textContent += `Preço: ${product.price}\n`;
      textContent += `Descrição: ${product.description}\n`;
      textContent += `URL: ${product.url}\n`;
      textContent += `Texto limpo para mineração: ${product.cleanText}\n`;
      textContent += `\n---\n\n`;
    });

    // Adiciona seção com apenas texto limpo para mineração
    textContent += `\n\n=== TEXTO LIMPO PARA MINERAÇÃO ===\n\n`;
    data.forEach((product, index) => {
      textContent += `${product.cleanText}\n`;
    });

    await fs.writeFile(txtPath, textContent, 'utf8');
    console.log(`Dados salvos em TXT: ${txtPath}`);
    return txtFilename;
  }

  async close() {
    await this.browser.close();
    console.log("Navegador fechado");
  }
}

app.post("/scrape", async (req, res) => {
  const { searchQuery, maxCount } = req.body;
  const URL = "https://www.netshoes.com.br/";

  if (!searchQuery || isNaN(maxCount) || maxCount <= 0 || maxCount == 42) {
    return res.status(400).send("Parâmetros inválidos");
  }

  const scraper = new ProductScraper(URL, searchQuery, maxCount);

  try {
    await scraper.initialize();
    await scraper.searchProducts();
    const links = await scraper.getProductLinks();

    const results = [];
    let c = 1;
    for (const link of links) {
      const productDetails = await scraper.getProductDetails(link, c);
      results.push(productDetails);
      c++;
    }

    // Salva os dados em CSV e TXT
    const csvFilename = await scraper.saveToCSV(results);
    const txtFilename = await scraper.saveToTXT(results);

    await scraper.close();
    
    res.json({
      products: results,
      files: {
        csv: csvFilename,
        txt: txtFilename
      },
      summary: {
        totalProducts: results.length,
        searchQuery: searchQuery,
        timestamp: scraper.timestamp
      }
    });
  } catch (error) {
    console.error('Erro durante o scraping:', error);
    await scraper.close();
    res.status(500).send("Erro ao realizar scraping");
  }
});

// Endpoint para listar arquivos disponíveis
app.get("/files", async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const fileList = files.map(file => {
      const filePath = path.join(DATA_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        type: path.extname(file).substring(1)
      };
    });
    res.json(fileList);
  } catch (error) {
    res.status(500).send("Erro ao listar arquivos");
  }
});

// Endpoint para download de arquivos
app.get("/download/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(DATA_DIR, filename);
    
    // Verifica se o arquivo existe
    if (!await fs.pathExists(filePath)) {
      return res.status(404).send("Arquivo não encontrado");
    }

    // Define o tipo de conteúdo baseado na extensão
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.csv' ? 'text/csv' : 'text/plain';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).send("Erro ao fazer download do arquivo");
  }
});

// Endpoint para visualizar conteúdo de arquivo
app.get("/view/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(DATA_DIR, filename);
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).send("Arquivo não encontrado");
    }

    const content = await fs.readFile(filePath, 'utf8');
    res.json({
      filename: filename,
      content: content,
      size: content.length
    });
  } catch (error) {
    res.status(500).send("Erro ao visualizar arquivo");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Dados serão salvos em: ${DATA_DIR}`);
});
