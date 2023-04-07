const { Builder, Browser, By } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
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
        .usingServer('Your Webdriver Endpoint') 
        .build();
        const url = "https://catalyst.zoho.com";
        const fetchMax =10;
    try {
        console.log("launching...")
        await driver.get(url);
        console.log("get into the page..")
        var allLinks = [];
//Will collect all the anchor tags that are present in the webpage
        var allLinkElements = await driver.findElements(By.css("a"));
        for (var i = 0; i < allLinkElements.length; i++) {
            allLinks.push(await allLinkElements[i].getAttribute("href"));
        }
        console.log("get all links..")
        console.log(allLinks)
        allLinks = [...new Set(allLinks)].slice(0,fetchMax);//Will remove duplicates and collect the first 10 anchor tags
        console.log("get page title for each link...")
        try {
            var summaryData = await getSummaryData(driver, allLinks);//Will collect the page titles of the first 10 anchor tags
            driver.close();
        } catch (e) {
            console.log(e);
        }
        console.log(summaryData);
//The scraped information will be written in the CSV file
        let csv = "";
        summaryData.forEach(eachData => {
            csv += "{ Title:" + eachData["title"] + '\n';
            csv += "hrefLink: " + eachData["hrefLink"] + " }" + '\n';
            csv += '\n';

        });
        fs.writeFileSync("Csv.csv", csv)
        console.log('File written.');
	

    }
    catch (ex) {
        console.log(ex);
    }

})();
async function getSummaryData(driver, allLinks) {
    var summaryData = [];
    for (let eachLink of allLinks) {
        if (eachLink != null) {
            if (eachLink.toString().startsWith("https:")) {
                let title = await navigateToPageAndGetTitle(driver, eachLink);
                summaryData.push({
                    "hrefLink": eachLink,
                    "title": title
                });
            }
        }
    }
    return summaryData;
}

async function navigateToPageAndGetTitle(driver, hrefLink) {
    try {
        await driver.get(hrefLink);
        return await driver.getTitle();

    } catch (error) {
        return "title not found";
    }

}