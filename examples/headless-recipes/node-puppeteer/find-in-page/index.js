const puppeteer = require('puppeteer');
const url = "https://www.zoho.com/en-in/terms.html"; //Input URL
const wordToSearch = "fees"; // Keyword
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
	//The location of the instances where the keyword is found in the input URL will be collected
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
	// Screenshots of the collected locations will be taken.
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