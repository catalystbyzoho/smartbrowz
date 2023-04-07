const playwright = require("playwright");
const fs = require('fs');
(async () => {
	const browser = await playwright.chromium.connectOverCDP({
		wsEndpoint: 'YOUR CDP ENDPOINT',
		args: ['--no-sandbox', '--disable-dev-shm-usage']
	});

	console.log("launching..");
	const page = await browser.newPage();
	const url = "https://catalyst.zoho.com";
	await page.goto(url);
	console.log("get into the page..");
	var allLinks = await page.evaluate(() => {
		var allLinks = [];
		var allLinkElements = document.getElementsByTagName("a");
//Get all the anchor tags present in the webpage
		for (var i = 0; i < allLinkElements.length; i++) {

			allLinks.push(allLinkElements[i].href);
		}

		return allLinks;
	});
	allLinks = [...new Set(allLinks)];//Remove duplicates from the scraped anchor tags and filter the first 10 hyperlinks
	console.log("scarpe all the links");
	console.log(allLinks);
	try {
		var summaryData = await getSummaryData(page, allLinks);
	} catch (e) {
		console.log(e); //Will collect the page titles of the collected anchor tags
	}
	console.log("Summary Data", summaryData);
	//The scraped information will be written in the CSV file
	let csv = "";
	summaryData.forEach(eachData => {
		csv += "{ Title:" + eachData["title"] + '\n';
		csv += "hrefLink: " + eachData["hrefLink"] + " }" + '\n';
		csv += '\n';

	});
	fs.writeFileSync("Csv.csv", csv)
	console.log('File is written.');
	await browser.close();
})();
async function getSummaryData(page, allLinks) {
	var summaryData = [];
	for (let eachLink of allLinks) {
		if (eachLink.toString().startsWith("https:")) {
			let title = await navigateToPageAndGetTitle(page, eachLink);
			summaryData.push({
				"hrefLink": eachLink,
				"title": title
			});
		}
	}
	return summaryData;
}

async function navigateToPageAndGetTitle(page, hrefLink) {
	try {
		await page.goto(hrefLink, { waitUntil: "domcontentloaded" });
		return await page.title();
	} catch (error) {
		return "title not found";
	}


}