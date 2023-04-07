const { Builder, Browser, By, until ,Key} = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome');

(async function index() {

    const webdriver = require('selenium-webdriver') 
    const chromeCapabilities = webdriver.Capabilities.chrome();
    var options = new chrome.Options();
    options.addArguments("--no-sandbox");
   // options.addArguments('--headless') 
    options.addArguments('--disable-dev-shm-usage')
    const driver = new webdriver.Builder()
  .forBrowser(Browser.CHROME) 
  .setChromeOptions(options)
  .withCapabilities(chromeCapabilities)
  .usingServer('YOUR WEBDRIVER ENDPOINT') 
  .build();


    try{
         driver.get('ENTER THE APPLICATION URL OF THE CATALYST DEMO POLLS APP');
         await driver.findElement(By.xpath("//*[@id='displayContent']/div/div[1]/div/div/a[1]")).click();
         await driver.manage().setTimeouts( { implicit: 10000 } );
         await driver.switchTo().frame(driver.findElement(By.xpath('//iframe')));
         await driver.findElement(By.xpath('//input[@name="username"]')).sendKeys("YOUR EMAILID");
         await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys('YOUR PASSWORD');
         await driver.findElement(By.xpath("/html/body/section/section/form/dl[5]/dd/input")).click();
         await driver.switchTo().defaultContent();
         await driver.findElement(By.xpath("//*[@id='displayContent']/div/div[1]/div[2]/button")).click();
         await driver.findElement(By.xpath("//*[@id=\"QuestionContent\"]")).sendKeys("Which is your preferred programming language?");
         await driver.findElement(By.xpath("//*[@id=\"Option1Content\"]")).sendKeys("java");
         await driver.findElement(By.xpath("//*[@id=\"Option2Content\"]")).sendKeys("nodeJs");
         await driver.findElement(By.xpath("//*[@id=\"Option3Content\"]")).sendKeys("python");
         await driver.findElement(By.xpath("//*[@id=\"Option4Content\"]")).sendKeys("c");
        driver.wait(
            until.elementLocated(By.id("Category")), 20000
        ).then(element => {
            selectByVisibleText(element, "Tv")
        });
      const dateBox = await driver.findElement(By.id("Duration"));
      await dateBox.sendKeys("12052023");
      await dateBox.sendKeys(Key.TAB);
     await dateBox.sendKeys("0450AM")
      await driver.findElement(By.xpath("//*[@id=\"savePoll\"]")).click();
      console.log("click");
      const ele= await driver.findElements(By.xpath("//*[contains(text(),'Your poll has been successfully created')]"));

      if(ele.length>0){
        console.log("Your poll has been successfully created");
      }
      else{
        console.log("Failed to a create poll")
      }
    }
    catch(e){
        console.log("Failed to a create poll "+e);
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