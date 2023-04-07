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


public class Polls {

  public static void main(String[] args) {
  
    String url = "ENTER THE APPLICATION URL OF THE CATALYST DEMO POLLS APP";

  ChromeOptions chromeOptions = new ChromeOptions();
  chromeOptions.addArguments("--no-sandbox");
  chromeOptions.addArguments("--headless");
  chromeOptions.addArguments("--disable-dev-shm-usage");
   

    try {
      RemoteWebDriver driver = new RemoteWebDriver(
        new URL("YOUR WEBDRIVER ENDPOINT"),
        chromeOptions);
      System.out.println("launching...");
      driver.get(url);
      driver.findElement( By.xpath("//a[contains(@class, 'pollapp-button') and @href='#login']")) .click();
      driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS) ;
      driver.switchTo().frame(driver.findElement(By.xpath("//iframe")));
      System.out.println("Enter into the frame");
      
      driver.findElement(By.xpath("//input[@name='username']")).sendKeys("YOUR EMAILID");
      driver.findElement(By.xpath("//input[@name='password']")).sendKeys("YOUR PASSWORD");
      
      driver.findElement(By.xpath("/html/body/section/section/form/dl[5]/dd/input")).click();
      
      System.out.println("Successfully logged in..");
      driver.switchTo().defaultContent();
      
      driver.findElement(By.xpath("//*[@id='displayContent']/div/div[1]/div[2]/button")).click();
      
      System.out.println("Start to create poll..");
      
      driver.findElement(By.xpath("//*[@id=\"QuestionContent\"]")).sendKeys("Which is your preferred programming language?");
      driver.findElement(By.xpath("//*[@id=\"Option1Content\"]")).sendKeys("java");
      driver.findElement(By.xpath("//*[@id=\"Option2Content\"]")).sendKeys("nodeJs");
      driver.findElement(By.xpath("//*[@id=\"Option3Content\"]")).sendKeys("python");
      driver.findElement(By.xpath("//*[@id=\"Option4Content\"]")).sendKeys("c");
      
      Select category = new Select(driver.findElement(By.id("Category")));
      category.selectByVisibleText("Tv");
      
      WebElement dateBox = driver.findElement(By.id("Duration"));
      dateBox.sendKeys("12052023");
      dateBox.sendKeys(Keys.TAB);
      dateBox.sendKeys("0340AM");
      
      driver.findElement(By.xpath("//*[@id=\"savePoll\"]")).click();
      
      List<WebElement> ele= driver.findElements(By.xpath("//*[contains(text(),'Your poll has been successfully created')]"));
      if(ele.size()>0) {
      System.out.println("Your poll has been successfully created");
      }
      else {
        System.out.print("Failed to create a poll");
      }
    } catch (Exception e) {
      System.out.println("Failed to create a poll");
      e.printStackTrace();
    } 
    
  }
}