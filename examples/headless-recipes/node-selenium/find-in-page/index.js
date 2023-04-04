
const fs = require('fs');
const { Builder, Browser, By, until } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');
;
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
    await driver.manage().setTimeouts({ implicit: 10000 });
    console.log("launching..")
    await driver.get('https://www.zoho.com/en-in/terms.html');
    console.log("Get into the page")
    //search the word by its path
    var searchedWord = await driver.findElements(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') ,'fees')]"));
    if (searchedWord.length != 0) {
        console.log("Word found..")
    }
    else {
        console.log("Word not Found..")
    }
    var count = 0;
    //Take screenshot
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

