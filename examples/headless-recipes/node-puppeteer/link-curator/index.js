const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
	const url = "https://catalyst.zoho.com"
	const fetchMax =10;
	try {
		const browser = await puppeteer.connect({
			browserWSEndpoint: 'Enter your CDP Endpoint',
			args: ['--no-sandbox', '--disable-dev-shm-usage']
		});

		console.log("Launching");
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "domcontentloaded" });
		console.log("Get into the page..");

//Get all the anchor tags present in the webpage
		var allLinks = await page.evaluate(() => {
			var allLinks = [];
			var allLinkElements = document.getElementsByTagName("a");

			for (var i = 0; i < allLinkElements.length; i++) {

				allLinks.push(allLinkElements[i].href);
			}

			return allLinks;
		});
		console.log("Scarpe all the links..");
		allLinks = [...new Set(allLinks)].slice(0,fetchMax);//Remove duplicates from the scraped anchor tags and filter the first 10 hyperlinks
		console.log(allLinks);
		try {
			var summaryData = await getSummaryData(await browser.newPage(), allLinks); //Will collect the page titles of the collected anchor tags
		} catch (e) {
			console.log(e);
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
		return await page.title();
	} catch (error) {
		console.log(error);
		return "title not found";
	}


}