import { Actor } from 'apify';
import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

await Actor.init();

const { keyword } = await Actor.getInput();
if (!keyword) throw new Error('Keyword input is required.');

const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

const response = await gotScraping({ url: searchUrl });
const $ = cheerio.load(response.body);

const products = [];

$('div.s-main-slot div[data-component-type="s-search-result"]').each((index, el) => {
    const title = $(el).find('h2 a span').text().trim();
    const link = 'https://www.amazon.com' + $(el).find('h2 a').attr('href');
    const price = $(el).find('.a-price .a-offscreen').first().text().trim();

    if (title && link) {
        products.push({ title, link, price });
    }
});

await Actor.pushData(products);
await Actor.exit();
