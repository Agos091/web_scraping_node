const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

class ProductScraper {
    constructor(url, searchQuery, maxCount) {
        this.url = url;
        this.searchQuery = searchQuery;
        this.maxCount = maxCount;
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        console.log('Navegador inicializado');
    }

    async searchProducts() {
        await this.page.goto(this.url);
        console.log('Achou Produto');

        await this.page.waitForSelector('#search');
        await this.page.type('#search', this.searchQuery);

        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click('.search__button')
        ]);

        console.log('Busca realizada');
    }

    async getProductLinks() {
        const links = await this.page.$$eval('.card[data-v-356668c2] a', elements => 
            elements.map(link => link.href)
        );
        return links.slice(0, this.maxCount);
    }

    async getProductDetails(link, c) {
        console.log('pagina', c);
        await this.page.goto(link);
        await this.page.waitForSelector('.product-name');

        // const title = await page.$eval('.product-name', element => element.innerText);
        const title = await this.page.evaluate(() => {
            const tl = document.querySelector('.product-name');
            if (!tl) return ("Titulo do item não foi encontrado");
            return tl.innerText;
        });

        // const price = await page.$eval('.saleInCents-value', element => element.innerText);
        const price = await this.page.evaluate(() => {
            const pc = document.querySelector('.saleInCents-value');
            if (!pc) return ("Preço do item não foi econtrado");
            return pc.innerText;
        });

        // const imageUrl = await page.$eval('.image-presenter-mobile__swiper-container[data-v-40abdf2a] img', img => img.src);
        const imageUrl = await this.page.evaluate(() => {
            const im = document.querySelector('.image-presenter-mobile__swiper-container[data-v-40abdf2a] img');
            if (!im) return ("Imagem do item não foi encontrado");
            return im.src;
        });

        // const description = await page.$eval('.showcase-details', element => element.innerText);
        const description = await this.page.evaluate(() => {
            const dc = document.querySelector('.showcase-details');
            if (!dc) return ("Descrição do item não foi encontrada");
            return dc.innerText;
        });

        return { title, price, imageUrl, description };
    }

    async close() {
        await this.browser.close();
        console.log('Navegador fechado');
    }
}

app.post('/scrape', async (req, res) => {
    const { searchQuery, maxCount } = req.body;
    const URL = "https://www.netshoes.com.br/";

    if (!searchQuery || isNaN(maxCount) || maxCount <= 0) {
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

        await scraper.close();
        res.json(results);
    } catch (error) {
        await scraper.close();
        res.status(500).send("Erro ao realizar scraping");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
