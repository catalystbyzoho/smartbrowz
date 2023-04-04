const puppeteer = require('puppeteer');
const url = "https://www.zoho.com/en-in/terms.html";
const wordToSearch = "fees";
(async function findInPage() {

	const browser = await puppeteer.connect({
		browserWSEndpoint: 'YOUR CDP ENDPOINT',
		args: ['--no-sandbox', '--disable-dev-shm-usage']
	});
	console.log("Launching...")
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "domcontentloaded" });
	console.log("Get into the page...")
	console.log("Searching...")
	//start to search word
	var foundWord = await page.evaluate((wordToSearch) => {
		var wordFound = window.find(wordToSearch);
		return JSON.stringify(wordFound);
	}, wordToSearch);
	if (foundWord == "true") {
		console.log("Word found..")
	}
	else {
		console.log("Word not found..")
	}
	var count = 1;
	// Take screenshot
	while (foundWord == "true") {
		await page.screenshot({ path: "shot" + count + ".png" });
		count++;
		foundWord = await page.evaluate((wordToSearch) => {
			var wordFound = window.find(wordToSearch);
			return JSON.stringify(wordFound);
		}, wordToSearch);
	}
	if(count>1)
	console.log("Screenshot taken..")
	await browser.close();


}
)().catch(err => {
	console.error(err);
	process.exit(1);
});

