const puppeteer = require('puppeteer');
const url = "https://www.manageengine.com/"; 

(async function GetLeads() {

	var contactsFound = [];

	const browser = await puppeteer.connect({
		browserWSEndpoint: 'YOUR CDP ENDPOINT',
		args: ['--no-sandbox', '--disable-dev-shm-usage']
	});

	console.log("Launching..")
	const page = await browser.newPage();
	await page.setViewport({ width: 1080, height: 800, isMobile: false });
	await page.goto("https://catalyst.zoho.com", { waitUntil: "domcontentloaded" });
	console.log("Get into the page..")

	// Get all the hyperlinks present in the webpage
	var allLinks = await page.evaluate(() => {
		var allLinks = [];
		var allLinkElements = document.getElementsByTagName("a");
		for (var i = 0; i < allLinkElements.length; i++) {
			allLinks.push(allLinkElements[i].href);
		}
		return allLinks;
	});
	allLinks = [...new Set(allLinks)]; // Delete any duplicates present in the scraped information.
	console.log("Scarpe all the links..")
	console.log(allLinks);

	var keywords = ["about", "contact", "support"]; //Keywords Input
	var possibleLinks = [];

	//If the inputted keywords are present in the scraped information, the corressponding anchor tags will be collected
	console.log("check if there are any other pages with the contact information.");
	allLinks.forEach(eachLink => {
		eachLink = eachLink.toString();
		keywords.forEach(eachKeyword => {
			if (eachLink.includes(eachKeyword) && eachLink.startsWith("https://")) {
				possibleLinks.push(eachLink);
			}
		});
	});
	console.log(possibleLinks) 
	var contactsFound = await checkIfAnyContacts(page, url) //Will scrape any contact information present in the inputted URL
	for await (var eachLink of possibleLinks) {
		var newContactsFound = await checkIfAnyContacts(page, eachLink); //The contact information present in the anchor tags collected in line 41 will be scraped
		contactsFound = contactsFound.concat(newContactsFound);
	}


	await browser.close();
	console.log("Found all the contact details..")
	contactsFound = [...new Set(contactsFound)];
	console.log(contactsFound); //Display the scraped contact information
	async function checkIfAnyContacts(page, hrefLink) {
		var contactsFound = [];
		const anchorKeywords = ["tel:", "mailto:", "twitter", "facebook", "instagram", "youtube", "linkedin", "github"];
		const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
		const mobileRegex = /(\+?[0-9-()+ ]{10,})/g;
		const whitespaceRegex = /^\s*$/;


		await page.goto(hrefLink, { waitUntil: "domcontentloaded" });
		var allLinks = await page.evaluate(() => {
			var allLinks = [];
			var allLinkElements = document.getElementsByTagName("a");
			for (var i = 0; i < allLinkElements.length; i++) {
				allLinks.push(allLinkElements[i].href);
			}
			return allLinks;
		});
		allLinks = [...new Set(allLinks)];


		allLinks.forEach(eachLink => {
			if (eachLink !== null) {
				eachLink = eachLink.toString();
				anchorKeywords.forEach(eachAnchorKeyword => {
					if (eachLink.includes(eachAnchorKeyword)) {
						contactsFound.push(eachLink);
					}
				});
			}
		});

		var possibleTexts = await page.evaluate(() => {
			var allText = document.querySelectorAll('p, span, div, td');
			var texts = [];
			allText.forEach(eachText => {
				texts.push(eachText.innerText);
			});
			return texts;
		});

		var contacts = [];
		possibleTexts.forEach(element => {
			if (element.match(emailRegex) != null) { contacts = contacts.concat(element.match(emailRegex)); }
			if (element.match(mobileRegex) != null) { contacts = contacts.concat(element.match(mobileRegex)); }
		});
		contacts = [...new Set(contacts)];

		contacts.forEach(eachContact => {
			if (!whitespaceRegex.test(eachContact)) {
				contactsFound.push(eachContact);
			}
		});
		return contactsFound;
	}

}
)().catch(err => {
	console.error(err);
	process.exit(1);
});