/**
 * This recipe enables you to crawl a webpage of your choice, search for a specific keyword that you specify, and
 * capture screenshots of the webpage. The screenshots will be saved in the .png format and stored in your project directory.
 * As an example, we have utilized Zoho's Terms of Service webpage and searched for the keyword "Fees". You can customize the
 * input by providing your own webpage and keyword.
 * */

const puppeteer = require('puppeteer');
// Input webpage url
const url = "https://www.zoho.com/en-in/terms.html";
// Keyword to search
const wordToSearch = "fees";

(async function () {
    console.log("Launching the headless browser");
    // To establish a connection to the browser in the Catalyst environment, you will need to replace the "browserWSEndpoint" with your CDP ENDPOINT.
    // This will allow you to establish a connection to the browser and utilize its functionalities.
    const browser = await puppeteer.connect({
        browserWSEndpoint: 'YOUR CDP ENDPOINT',
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    console.log(`Opening "${url}" in new tab`);
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "domcontentloaded"});

    let totalWordOccurrences = 0;

    while (true) {
        const foundWord = await page.evaluate(wordToSearch => JSON.stringify(window.find(wordToSearch)), wordToSearch);
        if (foundWord === "true") {
            ++totalWordOccurrences;
            console.log(`Word occurrence (${totalWordOccurrences}) found, taking screenshot`);
            await page.screenshot({path: "screenshot-" + totalWordOccurrences + ".png"});
        } else break;
    }

    if (totalWordOccurrences === 0)
        console.log("No word occurrence found");
    else
        console.log(`Total ${totalWordOccurrences} screenshots saved in local directory`)

    // Close the browser
    await browser.close();
})().catch(error => {
    console.log(error);
    process.exit(1);
});
