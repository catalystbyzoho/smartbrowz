const playwright = require("playwright");

const searchKeyword = "voice call";
const paidAlso = true;
const ratingGreaterThanOrEqualTo = "1"; // Allowed Values ["1", "2", "3", "4"]
const deploymentType = "Zoho platform";  // Allowed Values ["Zoho platform", "Built-in integrations", "API-built integrations"]
const fetchMax = 5;


const url = "https://marketplace.zoho.com/gsearch?" + "searchTerm=" + searchKeyword;

(async function scrapeZohoMarketplace() {
    const browser = await playwright.chromium.connectOverCDP({
        wsEndpoint: 'YOUR CDP ENDPOINT',
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    console.log("launching..")
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log("get into the page..")
    await sleep(3000);
    await page.evaluate(async ({ ratingGreaterThanOrEqualTo, deploymentType }) => {
        var ratings = document.getElementsByClassName("rating-row mB10 vam toCapital");
        switch (ratingGreaterThanOrEqualTo) {
            case "1": ratings[3].click(); break;
            case "2": ratings[2].click(); break;
            case "3": ratings[1].click(); break;
            case "4": ratings[0].click(); break;
            default: break;
        }
        await sleep(3000);


        var deploymentTypes = document.getElementById("deployment-filter-list").children;
        switch (deploymentType) {
            case "Zoho platform": deploymentTypes[0].click(); break;
            case "Built-in integrations": deploymentTypes[1].click(); break;
            case "API-built integrations": deploymentTypes[2].click(); break;
            default: break;
        }
        await sleep(3000);
        document.getElementById("Free").click();
        await sleep(3000);

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }, { ratingGreaterThanOrEqualTo, deploymentType });

    await sleep(10000);
    console.log("Scarpe the extension links..")
    var extensionLinks = await page.evaluate(async (paidAlso) => {
        var extensionLinks = [];
        var hrefLinks = document.getElementsByClassName("positionAbsolute t0 left0 r0");
        console.log(hrefLinks);
        // Scarpe only the free extension links
        for (var i = 0; i < hrefLinks.length; i++) {
            extensionLinks.push(hrefLinks[i].href);
        }

        if (paidAlso) { // Scarpe paid extension links also
            document.getElementById("Paid").click();
            await sleep(5000);
            hrefLinks = document.getElementsByClassName("positionAbsolute t0 left0 r0");
            for (var i = 0; i < hrefLinks.length; i++) {
                extensionLinks.push(hrefLinks[i].href);
            }

        }
        return extensionLinks;



        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }, paidAlso);

    extensionLinks = [...new Set(extensionLinks)].slice(0, fetchMax); //Remove dupliacte if any and fetch only needed number of links
    console.log(extensionLinks);
    console.log("Start to scarpe the extension page")
    for (let eachLink of extensionLinks) {
        const result = await scrapeExtensionPage(page, eachLink);
        console.log(result); // do something with the result
    }
    console.log("finish scarping")
    await browser.close();
}());

async function scrapeExtensionPage(page, hrefLink) {
    await page.goto(hrefLink, { waitUntil: "domcontentloaded" });
    var summary = await page.evaluate(() => {
        let summary = {};
        summary["title"] = document.getElementsByTagName("h1")[0].innerText;
        summary["builtFor"] = document.getElementsByClassName("redirectVendor")[1].innerText;
        summary["tagline"] = document.getElementsByClassName("extn-tagline extn-content")[0].innerText;
        summary["rating"] = document.getElementsByClassName("extn-sub-head averageRatingCount")[0].innerText;
        summary["detailedRatings"] = {
            "fiveStar": document.getElementsByClassName("fiveStar progressStar")[0].innerText,
            "fourStar": document.getElementsByClassName("fourStar progressStar")[0].innerText,
            "threeStar": document.getElementsByClassName("threeStar progressStar")[0].innerText,
            "twoStar": document.getElementsByClassName("twoStar progressStar")[0].innerText,
            "oneStar": document.getElementsByClassName("oneStar progressStar")[0].innerText
        };
        summary["shortDescription"] = document.getElementsByClassName("shortDescription extn-content")[0].innerText;
        keyFeatures = [];
        keyFeaturesElements = document.getElementById("keyfeature").children;
        for (let i = 0; i < keyFeaturesElements.length; i++) {
            keyFeatures.push(keyFeaturesElements[i].innerText)
        }
        summary["keyFeatures"] = keyFeatures;


        return summary;
    });
    console.log(summary);
    return summary;

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}