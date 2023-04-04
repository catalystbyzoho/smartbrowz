

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

public class terms {

	public static void main(String[] args) throws IOException {
		
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox");//No I18N
		chromeOptions.addArguments("--headless");//No I18N
		chromeOptions.addArguments("--disable-dev-shm-usage");//No I18N
		//Change ChromeDriver with RemoteWebDriver
		RemoteWebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),
				chromeOptions);//No I18N
            System.out.println("Launching..");
		
		try {
		String url = "https://www.zoho.com/en-in/terms.html";
		driver.get(url);
		System.out.println("Get into the page..");
		
		//Search word by its path
		List<WebElement> wordFound = driver.findElements(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') ,'fees')]"));
		System.out.println("Starts to search words...");
		int count =1;
		if(wordFound)
			System.out.println("Word Found");
		else
			System.out.println("Word not Found"):
		//Take screenshot
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
