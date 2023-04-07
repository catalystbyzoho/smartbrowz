const puppeteer = require('puppeteer');

const searchKeyword = "voice call";
const paidAlso = true; //Change to false is you wish to ignore paid extensions
 const ratingGreaterThanOrEqualTo = "4"; // Allowed Values ["1", "2", "3", "4"]
const deploymentType = "zohoplatform";  // Allowed Values ["zohoplatform", "builtin", "apibuilt"]



const url = "https://marketplace.zoho.com/gsearch?" + "searchTerm=" + searchKeyword;

(async function scrapeZohoMarketplace() {
    const browser = await puppeteer.connect({
        browserWSEndpoint: 'YOUR CDP ENDPOINT',
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    console.log("launching..");
    const page = await browser.newPage();
    await page.setViewport({ width: 1480, height: 900, isMobile: false });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log("get into the page..");
    await sleep(3000);
    await page.evaluate(async (ratingGreaterThanOrEqualTo, deploymentType) => {
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
            case "zohoplatform": deploymentTypes[0].click(); break;
            case "builtin": deploymentTypes[1].click(); break;
            case "apibuilt": deploymentTypes[2].click(); break;
            default: break;
        }
        await sleep(3000);

        document.getElementById("Free").click();
        await sleep(3000);

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }, ratingGreaterThanOrEqualTo, deploymentType);
    console.log("rated and deployment type selected..")
    await sleep(10000);

    var extensionLinks = await page.evaluate(async (paidAlso) => {
        var freeExtensionLinks = [];
        var paidExtensionLinks = [];
        const fetchMax = 5;
        var hrefLinks = document.getElementsByClassName("positionAbsolute t0 left0 r0");
        console.log(hrefLinks);
        //Scrape the links of all free extensions
        for (var i = 0; i < hrefLinks.length; i++) {
            freeExtensionLinks.push(hrefLinks[i].href);
        }
        extensionLinks = [...new Set(freeExtensionLinks)].slice(0, fetchMax) //Remove any duplicates if present, and store only the first 5 links
        if (paidAlso) {// Scrape the links of all the paid extensions
            document.getElementById("Paid").click();
            await sleep(5000);
            hrefLinks = document.getElementsByClassName("positionAbsolute t0 left0 r0");
            for (var i = 0; i < hrefLinks.length; i++) {
                paidExtensionLinks.push(hrefLinks[i].href);
            }
            extensionLinks = freeExtensionLinks.concat([...new Set(paidExtensionLinks)].slice(0,fetchMax));//Collect the first 5 links of paid extensions after removing duplicates


        }
        return extensionLinks;



        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }, paidAlso);

    extensionLinks = [...new Set(extensionLinks)];
    console.log(extensionLinks);
    for (let eachLink of extensionLinks) {
        const result = await scrapeExtensionPage(page, eachLink);
        console.log(result); //Displays the details of the scrapped extensions
    }
   
    console.log("Finish scarping..")
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

    return summary;

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}