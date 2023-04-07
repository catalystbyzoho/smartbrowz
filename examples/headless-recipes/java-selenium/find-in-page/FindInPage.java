import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import com.google.common.io.Files;

public class FindInPage {

	public static void main(String[] args) throws IOException {
		
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox");
		chromeOptions.addArguments("--headless");
		chromeOptions.addArguments("--disable-dev-shm-usage");
		RemoteWebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),
				chromeOptions);
            System.out.println("Launching..");
		
		try {
		String url = "https://www.zoho.com/en-in/terms.html"; // Sample URL
		String search ="fees"; //Sample Keyword
		driver.get(url);
		System.out.println("Get into the page..");
		
		//The location of the instances where the keyword is found in the input URL will be collected
		List<WebElement> wordFound = driver.findElements(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') ,search)]"));
		System.out.println("Starts to search words...");
		int count =1;
		if(wordFound)
			System.out.println("Word Found");
		else
			System.out.println("Word not Found"):
		//Screenshots of the collected locations will be taken.
		for(WebElement ele: wordFound) {
			File SrcFile=ele.getScreenshotAs(OutputType.FILE);
			File DestFile=new File("shot"+count+".png");
			Files.copy(SrcFile, DestFile);
			
			count++;	
		}
		if(count>1){
			System.out.println("Screenshot taken..");
		}
		
		}
		
		catch(Exception ex) {
			System.out.print("Exception occured..");
			 ex.printStackTrace();
		}
		driver.quit();
		
		
	}

}