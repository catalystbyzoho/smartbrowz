const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const url = "https://catalyst.zoho.com"
	try {
		const browser = await puppeteer.connect({
			browserWSEndpoint: 'ws://browser360.localcatalystserverless.app/__catalyst/headless-chrome?projectId=3587000000018001&api-key=a10d7187fb186980b31fcf1b1dd6b26f58c69107ed1c7fad22dcc1b8c9b0d9f3',
			args: ['--no-sandbox', '--disable-dev-shm-usage']
		});

		console.log("Launching");
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "domcontentloaded" });
		console.log("Get into the page..");

		// Get All the Links from Anchor<a> Elements
		var allLinks = await page.evaluate(() => {
			var allLinks = [];
			var allLinkElements = document.getElementsByTagName("a");

			for (var i = 0; i < allLinkElements.length; i++) {

				allLinks.push(allLinkElements[i].href);
			}

			return allLinks;
		});
		console.log("Scarpe all the links..");
		allLinks = [...new Set(allLinks)];//Remove duplicate if any
		console.log(allLinks);
		try {
			var summaryData = await getSummaryData(await browser.newPage(), allLinks);
		} catch (e) {
			console.log(e);
		}
		console.log("Summary Data", summaryData);
		let csv = "";
		summaryData.forEach(eachData => {
			csv += "{ Title:" + eachData["title"] + '\n';
			csv += "hrefLink: " + eachData["hrefLink"] + " }" + '\n';
			csv += '\n';

		});
		fs.writeFileSync("Csv.csv", csv)
		console.log('File is written.');

		browser.close();

	}
	catch (e) {
		console.log(e);
	}


})()

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
		return await page.title();//Return the page title
	} catch (error) {
		console.log(error);
		return "title not found";
	}


}
