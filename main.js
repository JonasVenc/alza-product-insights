import { Actor } from 'apify';
import cheerio from 'cheerio';
import { gotScraping } from 'got-scraping';

await Actor.init();

const { keyword } = await Actor.getInput();
if (!keyword) throw new Error('Keyword input is required.');

const searchUrl = `https://www.alza.cz/search.htm?exps=${encodeURIComponent(keyword)}`;
const response = await gotScraping({ url: searchUrl });
const $ = cheerio.load(response.body);

const products = [];

$('.box .row').each((index, el) => {
    const title = $(el).find('.name').text().trim();
    const price = $(el).find('.price-box .price').first().text().trim();
    const link = 'https://www.alza.cz' + $(el).find('.name a').attr('href');

    if (title && link) {
        products.push({ title, price, link });
    }
});

console.log(`Extracted ${products.length} products`);
await Actor.pushData(products);
await Actor.exit();
