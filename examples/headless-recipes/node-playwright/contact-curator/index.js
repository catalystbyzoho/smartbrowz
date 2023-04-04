const playwright = require("playwright");
const url = "https://www.manageengine.com/";

(async function GetLeads() {

	var contactsFound = [];
	const browser = await playwright.chromium.connectOverCDP({
		wsEndpoint: 'YOUR CDP ENDPOINT',
		args: ['--no-sandbox', '--disable-dev-shm-usage']
	});

	const page = await browser.newPage();
	console.log("Launching..")
	await page.setViewportSize({ width: 1080, height: 800, isMobile: false });

	await page.goto(url, { waitUntil: "domcontentloaded" });
	console.log("Get into the page..")
	// Get All the Links from Anchor<a> Elements
	var allLinks = await page.evaluate(() => {
		var allLinks = [];
		var allLinkElements = document.getElementsByTagName("a");
		for (var i = 0; i < allLinkElements.length; i++) {
			allLinks.push(allLinkElements[i].href);
		}
		return allLinks;
	});
	allLinks = [...new Set(allLinks)]; //delete the duplicates if any
	console.log("Scarpe all the links..")
	var keywords = ["about", "contact", "support"];
	var possibleLinks = [];
	//check if there are any other pages with the contact information.
	console.log("check if there are any other pages with the contact information.")
	allLinks.forEach(eachLink => {
		eachLink = eachLink.toString();
		keywords.forEach(eachKeyword => {
			if (eachLink.includes(eachKeyword) && eachLink.startsWith("https://")) {
				possibleLinks.push(eachLink);
			}
		});
	});
	console.log(possibleLinks)
	var contactsFound = await checkIfAnyContacts(page, url)
	for await (var eachLink of possibleLinks) {
		var newContactsFound = await checkIfAnyContacts(page, eachLink);
		contactsFound = contactsFound.concat(newContactsFound);
	}
	await browser.close();
	contactsFound = [...new Set(contactsFound)];
	console.log("Found all contact details..")
	console.log(contactsFound);
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
			eachLink = eachLink.toString();
			anchorKeywords.forEach(eachAnchorKeyword => {
				if (eachLink.includes(eachAnchorKeyword)) {
					contactsFound.push(eachLink);
				}
			});
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

