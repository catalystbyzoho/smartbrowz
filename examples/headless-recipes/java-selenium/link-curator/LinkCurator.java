import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.net.URL;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;


public class LinkCurator {
	public static void main(String[] args) throws IOException {
		String url = "https://catalyst.zoho.com";
		int fetchMax = 10;
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox");//No I18N
		chromeOptions.addArguments("--headless");//No I18N
		chromeOptions.addArguments("--disable-dev-shm-usage");//No I18N
		WebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),      
				chromeOptions);//No I18N
		Set<String> link1 = new LinkedHashSet<String>();
		try {
			System.out.println("Launching Selenium....");
			driver.get(url);
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
			System.out.println("Get into the page");
			
		  	//scarpe all the links
	       		List<WebElement> allLinks = driver.findElements(By.tagName("a"));
	       		System.out.println("Scarpe all the links");
	        	for(WebElement link: allLinks) {
				String links = link.getAttribute("href");
				if(links!=null) {
					if(links.startsWith("https:")) {
						link1.add(links);
						fetchMax--;
					}
				}
				if(fetchMax<0){
					break;
				}
			}

			System.out.println(Scarpe all the links..);
			
			FileWriter writer = new FileWriter("Csv.csv");
				for(String s : link1) {
					String title = navigateToPageAndGetTitle(driver,s);
					writer.append("{Title: ");
					writer.append(title+" }");
					writer.append("{Hreflink: ");
					writer.append(s+" ");
					writer.append("\n");
					writer.append("\n");
					System.out.println(title);
				}
				System.out.println("File written");
				writer.close();
			}
		
		catch(Exception ex) {
			
			System.out.println("Exception "+ex);
		}
		driver.quit();
		}

		//Navigate to the page and get title
		private static String navigateToPageAndGetTitle(WebDriver driver1, String s) {
			try {
				driver1.get(s);
				return driver1.getTitle();
						
			}
			catch(Exception ex) {
				return "Title not found";
			}

	}
}






