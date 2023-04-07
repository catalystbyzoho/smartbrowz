import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;



public class Marketplace {
	public static void main(String[] args) throws IOException {
	
		String searchKeyword = "voice call";
		boolean paidAlso = true; //Change to false is you wish to ignore paid extensions
		String ratingGreaterThanOrEqualTo = "4"; // Allowed Values ["1", "2", "3", "4"]
		String deploymentType = "Zoho platform";  // Allowed Values ["Zoho platform", "Built-in integrations", "API-built integrations"]
		int fetchMax = 5;
		String url ="https://marketplace.zoho.com/gsearch?" + "searchTerm=" + searchKeyword;
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox");//No I18N
		chromeOptions.addArguments("--headless");//No I18N
		chromeOptions.addArguments("--disable-dev-shm-usage");
		chromeOptions.addArguments("--remote-allow-origins=*");
		
		
		RemoteWebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),
				chromeOptions);
		
		System.out.println("Launching..");
		 driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
		 driver.get(url);
		 System.out.println("Get into the page..");
		 
		 switch(ratingGreaterThanOrEqualTo) {
			case "1" : driver.findElement( By.xpath("//*[@id=\\\"rating-object\\\"]/div[4]")) .click();break;
			case "2" : driver.findElement( By.xpath("//*[@id=\"rating-object\"]/div[3]")).click(); break;
			case "3" : driver.findElement( By.xpath("//*[@id=\"rating-object\"]/div[2]")).click(); break;
			case "4" : driver.findElement( By.xpath("//*[@id=\"rating-object\"]/div[1]")).click(); break;
			default : break;
			}
				
		 System.out.println("rated..");
			switch(deploymentType) {
			case "Zoho platform" :driver.findElement( By.xpath("//*[@id=\"13\"]/a")).click(); break;
			case "Built-in integrations" :driver.findElement( By.xpath("//*[@id=\"14\"]/a")).click(); break;
			case "API-built integrations" :driver.findElement( By.xpath("//*[@id=\"15\"]/a")).click(); break;
			default : break;
		}
			System.out.println("deployment type selected..");
			driver.findElement(By.xpath("//*[@id=\"pricing-object\"]/div[1]/div/label")).click();
			WebElement extensionlink = driver.findElement(By.xpath("//*[@id='extension-listed']"));
			
			List<WebElement> freeLinks =extensionlink.findElements( By.xpath("div[@class='default-card-wrapper  dIB mR20 mB20 box-borderBx posrel w320']"));
		    Set<String> extensionLinks = new LinkedHashSet<String>(); //remove duplicate
		     
		    int count=0;
		  //Scrape the links of all free extensions
		    for (int j = 0; j < freeLinks.size(); j++) {
				String link = freeLinks.get(j).findElement(By.xpath("a[@class='positionAbsolute t0 left0 r0']")).getAttribute("href");
				extensionLinks.add(link);
				count++;
				if(count==fetchMax) { //Remove any duplicates if present, and store only the first 5 links
					count =0;
					break;
				}
			}
		    
		 // Scrape the links of all the paid extensions
		    if(paidAlso) {
		    	driver.findElement( By.xpath("//*[@id=\"pricing-object\"]/div[2]/div/label")).click(); 
		    	WebElement paidExtensionLink =driver.findElement(By.xpath("//*[@id='extension-listed']"));
				List<WebElement> paidLinks = paidExtensionLink.findElements( By.xpath("div[@class='default-card-wrapper  dIB mR20 mB20 box-borderBx posrel w320']"));
				for (int i = 0; i < fetchMax; i++) {
				   String  link =  paidLinks.get(i).findElement( By.xpath("a[@class='positionAbsolute t0 left0 r0']")).getAttribute("href");
				   	count++;
					extensionLinks.add(link);
					if(count == fetchMax) { //Collect the first 5 links of paid extensions after removing duplicates
						break;
					}
			}
			}
			System.out.println("Start to scarpe the extension page details..");
			ArrayList<HashMap<String, String>> finalResults = new ArrayList<HashMap<String, String>>();
			for(String link : extensionLinks) {
				HashMap<String, String> map = scrapeExtensionPage(driver, link);
				finalResults.add(map);
			}
			// Displays the details of the scrapped extensions
			for (HashMap<String, String> map : finalResults) {
				System.out.println("Title: " +map.get("title") + "\n" +"builtFor: "+ map.get("BuiltFor") + "\n" +"TagLine: " + map.get("tagline") + "\n" + "Rating: "+ map.get("rating") + "\n" + "Detailed Rating: "+ map.get("detailedRatings") + "\n" + "Short Description: "+map.get("shortDescription") + "\n" +"Key Features: "+ map.get("keyFeatures"));
				System.out.println();
			}
			
	}
	
	private static HashMap<String,String> scrapeExtensionPage(WebDriver driver, String s) {
        driver.get(s);
		HashMap<String, String> details = new HashMap();
		try {
			details.put("title",(driver.findElement( By.xpath("//*[@id=\"isFrame\"]/div[2]/h1")).getText()));
			details.put("builtFor",(driver.findElement( By.xpath("//*[@id=\"isFrame\"]/div[2]/span[1]/span/a")).getText()));
			details.put("tagline",(driver.findElement( By.xpath("//*[@id=\"isFrame\"]/div[2]/p[1]")).getText()));      
			WebElement ratingInfo = driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]"));
			details.put("rating",(ratingInfo.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[1]/div/div[1]")).getAttribute("innerText")));
			HashMap<String, String> detailRating = new HashMap();
			detailRating.put("fiveStar",(driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[1]")).getAttribute("innerText")));
			detailRating.put("fourStar",(driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[2]")).getAttribute("innerText")));   
			detailRating.put("threeStar",(driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[3]")).getAttribute("innerText")));
			detailRating.put("twoStar",(driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[4]")).getAttribute("innerText")));
			detailRating.put("oneStar",(driver.findElement( By.xpath("//*[@id=\"ratingsReview\"]/div/div[1]/div[2]/div/div[5]")).getAttribute("innerText")));
			details.put("detailedRatings",detailRating.toString());
			details.put("shortDescription",(driver.findElement( By.xpath("//*[@id=\"overview\"]/div[1]/p[1]")).getAttribute("innerText")));      
			
			
			WebElement feat = driver.findElement( By.xpath("//*[@id=\"keyfeature\"]"));
			List<WebElement> keyFeaturesElements = feat.findElements(By.tagName("li"));
			String keyFeat = "";
			for(int i=0;i<keyFeaturesElements.size();i++) {
				keyFeat += keyFeaturesElements.get(i).getText();
				keyFeat += "\n";
				
			}
			details.put("keyFeatures",keyFeat);      
		}
		catch(Exception ex) {
			System.out.print(ex);
		}
		return details;
		
	}	
}