const fs = require('fs');
const { Builder, Browser, By, until } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');
;
const searchWord ="fees";// Keyword
(async function index() {
    const webdriver = require('selenium-webdriver')
    const chromeCapabilities = webdriver.Capabilities.chrome();
    var options = new chrome.Options();
    options.addArguments("--no-sandbox");
    options.addArguments('--headless')
    options.addArguments('--disable-dev-shm-usage')
    const driver = new webdriver.Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .withCapabilities(chromeCapabilities)
        .usingServer('YOUR WEBDRIVER ENDPOINT')
        .build();
        const url ="https://www.zoho.com/en-in/terms.html"; //URL
    await driver.manage().setTimeouts({ implicit: 10000 });
    console.log("launching..")
    await driver.get(url);
    console.log("Get into the page")
    // Collects the location of the instances where the keyword has been found
    var searchedWord = await driver.findElements(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') ,searchWord)]"));
    if (searchedWord.length != 0) {
        console.log("Word found..")
    }
    else {
        console.log("Word not Found..")
    }
    var count = 0;
    //Screenshots of the collected locations are taken
    for (var i = 0; i < searchedWord.length; i++) {
        let encodedString = await searchedWord[i].takeScreenshot(true);
        await fs.writeFileSync('image' + count + '.png', encodedString, 'base64');
        count++;
    }
    console.log("Screenshot taken..")
    await driver.close();
}
)().catch(err => {
    console.error(err);
    process.exit(1);
});