const { Builder, Browser, By, until } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');
(async function index() {
    const webdriver = require('selenium-webdriver')
    const chromeCapabilities = webdriver.Capabilities.chrome();
    var options = new chrome.Options();
    options.addArguments("--no-sandbox");
    options.addArguments('--headless')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--remote-allow-origins=*')
    const driver = new webdriver.Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .withCapabilities(chromeCapabilities)
        .usingServer('https://73473952:a10d7187fb186980b31fcf1b1dd6b26f58c69107ed1c7fad22dcc1b8c9b0d9f3@apiagent.catalyst.localzoho.com/browser360/webdriver/3587000000018001')
        .build();
    //let driver = await new Builder().forBrowser(Browser.CHROME).build()
    try {
        console.log("lanuching..")
        await driver.get('https://www.manageengine.com/');
        console.log('Get into the page..')
        var contactsFound = [];
        var allLinks = [];
        var allLinkElements = await driver.findElements(By.css("a"));
        for (var i = 0; i < allLinkElements.length; i++) {
            allLinks.push(await allLinkElements[i].getAttribute("href"));
        }

        allLinks = [...new Set(allLinks)];
        console.log("Scarpe all the links");
        console.log(allLinks)
        var keywords = ["about", "contact", "support"];
        var possibleLinks = [];
        console.log("check if there are any other pages with the contact information.");
        allLinks.forEach(eachLink => {
            if(eachLink!= null){
            eachLink = eachLink.toString();
            keywords.forEach(eachKeyword => {
                if (eachLink.includes(eachKeyword) && eachLink.startsWith("https://")) {
                    possibleLinks.push(eachLink);
                }
            });
        }
        });
        console.log(possibleLinks);
        var contactsFound = await checkIfAnyContacts(driver, 'https://www.manageengine.com/')
        for await (var eachLink of possibleLinks) {
            var newContactsFound = await checkIfAnyContacts(driver, eachLink);
            if (newContactsFound !== null)
                contactsFound = contactsFound.concat(newContactsFound);
        }
        await driver.close();
        contactsFound = [...new Set(contactsFound)];
        console.log("Found all the contacts details")
        console.log(contactsFound);


    }
    catch (e) {
        console.log(e)
    }
})();
async function checkIfAnyContacts(driver, hrefLink) {
    var contactsFound = [];
    const anchorKeywords = ["tel:", "mailto:", "twitter", "facebook", "instagram", "youtube", "linkedin", "github"];
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    //	const linkRegex = /((https?:\/\/)?([a-zA-Z0-9]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9#?=&_%.]*)?)/g;
    const mobileRegex = /(\+?[0-9-()+ ]{10,})/g;
    const whitespaceRegex = /^\s*$/;


    await driver.get(hrefLink);
    var allLinks = [];
    var allLinkElements = await driver.findElements(By.css("a"));

    for (var i = 0; i < allLinkElements.length; i++) {

        allLinks.push(await allLinkElements[i].getAttribute("href"));
    }

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

    var allText = await driver.findElements(By.css('p, span, div, td'));
    var texts = [];
    for (var i = 0; i < allText.length; i++) {
        const text = await allText[i].getText();
        texts.push(await allText[i].getText());
    }
    var contacts = [];
    texts.forEach(element => {
        if (element.match(emailRegex) != null) { contacts = contacts.concat(element.match(emailRegex)); }
        //	if(element.match(linkRegex) != null) { contacts = contacts.concat(element.match(linkRegex)); }
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


