const { Builder, Browser, By, until ,Keys} = require('selenium-webdriver');

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
    try{
	    console.log("Launching..")
         driver.get('https://polls-766644477.development.catalystserverless.com/app/');
	    console.log("get into the page..");
         await driver.findElement(By.linkText("Login")).click();
         await driver.manage().setTimeouts( { implicit: 10000 } );

	  // Get into the iframe
         await driver.switchTo().frame(driver.findElement(By.xpath('//iframe')));
         await driver.findElement(By.xpath('//input[@name="username"]')).sendKeys("YOUR USERNAME");
         await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys('YOUR PASSWORD');
         await driver.findElement(By.xpath("/html/body/section/section/form/dl[5]/dd/input")).click();
         await driver.switchTo().defaultContent();
	    console.log("Successfully logged in..");

         await driver.findElement(By.xpath("//*[@id='displayContent']/div/div[1]/div[2]/button")).click();
         await driver.findElement(By.xpath("//*[@id=\"QuestionContent\"]")).sendKeys("Which is your favourite programming language?");
         await driver.findElement(By.xpath("//*[@id=\"Option1Content\"]")).sendKeys("nodejs");
         await driver.findElement(By.xpath("//*[@id=\"Option2Content\"]")).sendKeys("java");
         await driver.findElement(By.xpath("//*[@id=\"Option3Content\"]")).sendKeys("python");
         await driver.findElement(By.xpath("//*[@id=\"Option4Content\"]")).sendKeys("c");

         driver.wait(
            until.elementLocated(By.id("Category")), 20000
         ).then(element => {
            selectByVisibleText(element, "Tv")
         });

         const dateBox = await driver.findElement(By.id("Duration"));
         dateBox.sendKeys("12052023");
         dateBox.sendKeys(Keys.TAB);
         dateBox.sendKeys("0340PM");
         await driver.findElement(By.xpath("//*[@id=\"savePoll\"]")).click();

	 //Check whether polls successfully created or not
         const ele= await driver.findElements(By.xpath("//*[contains(text(),'Your poll has been successfully created')]"));
         console.log(ele);
         if(ele){
            console.log("Poll successfully created");
         }
         else{
            console.log("Failed to create poll")
         }
	 driver.quit();
    }
    catch{
        console.log("Failed to create poll");
    }
})();

function selectByVisibleText(select, textDesired) {
    select.findElements(By.tagName('option'))
    .then(options => {
        options.map(option => {
            option.getText().then(text => {
                if (text == textDesired)
                    option.click();
            });
        });
    });
}