
import java.net.URL;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.Select;

public class polls {

  public static void main(String[] args) {
	
    	String url = "https://polls-766644477.development.catalystserverless.com/app/";

	ChromeOptions chromeOptions = new ChromeOptions();
	chromeOptions.addArguments("--no-sandbox");//No I18N
	chromeOptions.addArguments("--headless");//No I18N
	chromeOptions.addArguments("--disable-dev-shm-usage");
   
    try {
    	RemoteWebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),
				chromeOptions);
	 System.out.println("Launching..");
	 
	 //Naviagte to the page
         driver.get(url);
	 System.out.println("Get into the page..");

      	 driver.findElement( By.xpath("//a[contains(@class, 'pollapp-button') and @href='#login']")) .click();
      	 driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS) ;
	
      	 //Get into the iframe
      	 driver.switchTo().frame(driver.findElement(By.xpath("//iframe")));
      
      driver.findElement(By.xpath("//input[@name='username']")).sendKeys("YOUR USERNAME");
      driver.findElement(By.xpath("//input[@name='password']")).sendKeys("YOUR PASSWORD");
      
      driver.findElement(By.xpath("/html/body/section/section/form/dl[5]/dd/input")).click();
      driver.switchTo().defaultContent();
	 System.out.println("Successfully logged in");
      
      driver.findElement(By.xpath("//*[@id='displayContent']/div/div[1]/div[2]/button")).click();

	System.out.println("Start to create poll");
      
      driver.findElement(By.xpath("//*[@id=\"QuestionContent\"]")).sendKeys("Which is your favourite programming language?");
      driver.findElement(By.xpath("//*[@id=\"Option1Content\"]")).sendKeys("nodes");
      driver.findElement(By.xpath("//*[@id=\"Option2Content\"]")).sendKeys("java");
      driver.findElement(By.xpath("//*[@id=\"Option3Content\"]")).sendKeys("python");
      driver.findElement(By.xpath("//*[@id=\"Option4Content\"]")).sendKeys("C");
      
      Select category = new Select(driver.findElement(By.id("Category")));
      category.selectByVisibleText("Tv");
      
      WebElement dateBox = driver.findElement(By.id("Duration"));
      dateBox.sendKeys("12052023");
      dateBox.sendKeys(Keys.TAB);
      dateBox.sendKeys("0340AM");
      
      driver.findElement(By.xpath("//*[@id=\"savePoll\"]")).click();

      //Check whether polls successfully created or not
      List<WebElement> ele= driver.findElements(By.xpath("//*[contains(text(),'Your poll has been successfully created')]"));
      if(ele.size()>0) {
      System.out.println("Polls created successfully");
      }
      else {
    	  System.out.print("Failed to create poll");
      }
    } catch (Exception e) {
      System.out.println("Failed to create poll");
      e.printStackTrace();
    } 
    driver.quit();
    
  }
}
