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
        .usingServer('YOUR WEBDRIVER ENDPOINT')
        .build();
        const url ="https://www.manageengine.com/"
    try {
        console.log("lanuching..")
        await driver.get(url);
        console.log('Get into the page..')
        var contactsFound = [];
        var allLinks = [];
//Will scrape all the anchor tags
        var allLinkElements = await driver.findElements(By.css("a"));
        for (var i = 0; i < allLinkElements.length; i++) {
            allLinks.push(await allLinkElements[i].getAttribute("href"));
        }

        allLinks = [...new Set(allLinks)];
        console.log("Scarpe all the links");
        console.log(allLinks)
        var keywords = ["about", "contact", "support"]; //The keywords that will be used to filter anchor tags that contain contact information
        var possibleLinks = [];
        console.log("check if there are any other pages with the contact information.");
        allLinks.forEach(eachLink => {
            if(eachLink!= null){
            eachLink = eachLink.toString();
            keywords.forEach(eachKeyword => {
                if (eachLink.includes(eachKeyword) && eachLink.startsWith("https://")) {
                    possibleLinks.push(eachLink); //All the required anchor tags are collected
                }
            });
        }
        });
        console.log(possibleLinks);
        var contactsFound = await checkIfAnyContacts(driver, url) //The contact information present in the inputted URL will be collected
        for await (var eachLink of possibleLinks) {
            var newContactsFound = await checkIfAnyContacts(driver, eachLink); //The contact information present in the anchor tags collected in line 40 will be scraped
            if (newContactsFound !== null)
                contactsFound = contactsFound.concat(newContactsFound);
        }
        await driver.close();
        contactsFound = [...new Set(contactsFound)];
        console.log("Found all the contacts details")
        console.log(contactsFound); //The scraped contact information will be displayed


    }
    catch (e) {
        console.log(e)
    }
})();
async function checkIfAnyContacts(driver, hrefLink) {
    var contactsFound = [];
    const anchorKeywords = ["tel:", "mailto:", "twitter", "facebook", "instagram", "youtube", "linkedin", "github"];
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
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