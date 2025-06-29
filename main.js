const Apify = require('apify');
const { gotScraping } = require('got-scraping');
const cheerio = require('cheerio');

Apify.main(async () => {
    const input = await Apify.getInput();
    const keyword = input.keyword || 'smart home gadgets';
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

    await Apify.pushData(products);
});
