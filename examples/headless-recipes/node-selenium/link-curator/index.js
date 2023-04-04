
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
        .usingServer('https://73473952:a10d7187fb186980b31fcf1b1dd6b26f58c69107ed1c7fad22dcc1b8c9b0d9f3@apiagent.catalyst.localzoho.com/browser360/webdriver/3587000000018001') 
        .build();
    //let driver = await new Builder().forBrowser(Browser.CHROME).build()
    try {
        console.log("launching...")
        await driver.get('https://catalyst.zoho.com');
        console.log("get into the page..")
        var allLinks = [];
        var allLinkElements = await driver.findElements(By.css("a"));
        for (var i = 0; i < allLinkElements.length; i++) {
            allLinks.push(await allLinkElements[i].getAttribute("href"));
        }
        console.log("get all links..")
        console.log(allLinks)
        allLinks = [...new Set(allLinks)];
        console.log("get page title for each link...")
        try {
            var summaryData = await getSummaryData(driver, allLinks);
            driver.close();
        } catch (e) {
            console.log(e);
        }
        console.log(summaryData);
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
