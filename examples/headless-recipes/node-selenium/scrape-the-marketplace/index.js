
const { Builder, Browser, By, until } = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');

(async function index() {

    const searchKeyword = "voice call";
    const paidAlso = true;
    const ratingGreaterThanOrEqualTo = "2"; // Allowed Values ["1", "2", "3", "4"]
    const deploymentType = "Zoho platform";  // Allowed Values ["Zoho platform", "Built-in integrations", "API-built integrations"]
    const fetchMax = 5;
    const url = "https://marketplace.zoho.com/gsearch?" + "searchTerm=" + searchKeyword;
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
    console.log("launching..")
    await driver.get(url);
    await driver.manage().setTimeouts({ implicit: 10000 });
    console.log("Get into the page")
    var ratings = await driver.findElements(By.className("rating-row mB10 vam toCapital"))
    switch (ratingGreaterThanOrEqualTo) {
        case "1": ratings[3].click(); break;
        case "2": ratings[2].click(); break;
        case "3": ratings[1].click(); break;
        case "4": ratings[0].click(); break;
        default: break;
    }
    console.log("rated..")
    var deploymentTypes = await driver.findElement(By.id("deployment-filter-list"))
    var liTag = await deploymentTypes.findElements(By.css("li"));
    for (var i = 0; i < liTag.length; i++) {
        var type = await liTag[i].getText()
        if (deploymentType === type) {
            liTag[i].click();
        }
    }
    await driver.manage().setTimeouts({ implicit: 10000 });
    console.log("deployment type selected..")
    await driver.findElement(By.xpath("//*[@id='pricing-object']/div[1]/div/label")).click();
    console.log("Scarpe the extension links..")
    var extensionLinks = [];
    var hrefLinks = await driver.findElements(By.className("positionAbsolute t0 left0 r0"))

    //Scarpe only free extension links
    for (var i = 0; i < hrefLinks.length; i++) {
        extensionLinks.push(await hrefLinks[i].getAttribute("href"));
    }

    //Scarpe paid extension links
    if (paidAlso) {
        await driver.findElement(By.xpath("//*[@id='pricing-object']/div[2]/div/label")).click();
        hrefLinks = await driver.findElements(By.className("positionAbsolute t0 left0 r0"));
        for (var i = 0; i < hrefLinks.length; i++) {
            extensionLinks.push(await hrefLinks[i].getAttribute("href"));
        }

    }
    extensionLinks = [...new Set(extensionLinks)].slice(0, fetchMax);//Remove dupliacte if any and fetch only needed number of links
    console.log(extensionLinks)
    console.log("Start to scarpe the extension page")
    for (let eachLink of extensionLinks) {
        const result = await scrapeExtensionPage(driver, eachLink);
        console.log(result);
    }
    console.log("finish scarping..")
    await driver.close();
}
)().catch(err => {
    console.error(err);
    process.exit(1);
});



async function scrapeExtensionPage(driver, hrefLink) {
    await driver.get(hrefLink);

    //scarpe extension link page details
    let summary = {};
    summary["title"] = await driver.findElement((By.css("h1"))).getText();
    var builtFor = await driver.findElements(By.className("redirectVendor"));
    //console.log(await builtFor[1].getText())
    summary["builtFor"] = await builtFor[1].getText();

    summary["tagline"] = await driver.findElement(By.className("extn-tagline extn-content")).getText();
    summary["rating"] = await driver.findElement(By.className("extn-sub-head averageRatingCount")).getText();

    summary["detailedRatings"] = {
        "fiveStar": await driver.findElement(By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[1]")).getAttribute("innerText"),
        "fourStar": await driver.findElement(By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[2]")).getAttribute("innerText"),
        "threeStar": await driver.findElement(By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[3]")).getAttribute("innerText"),
        "twoStar": await driver.findElement(By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[4]")).getAttribute("innerText"),
        "oneStar": await driver.findElement(By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[5]")).getAttribute("innerText")
    };
    summary["shortDescription"] = await driver.findElement(By.className("shortDescription extn-content")).getText();
    keyFeatures = [];
    const keyFeaturesElements = await driver.findElement(By.id("keyfeature"));
    var liTags = await keyFeaturesElements.findElements(By.css('li'))
    for (let i = 0; i < liTags.length; i++) {
        keyFeatures.push(await liTags[i].getText())
    }
    summary["keyFeatures"] = keyFeatures;
    return summary;
}
