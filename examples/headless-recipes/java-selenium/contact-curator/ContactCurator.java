
import java.io.IOException;
import java.net.URL;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

public class ContactCurator {
	public static void main(String[] args) throws IOException {
		String url = "https://www.manageengine.com/";
		ChromeOptions chromeOptions = new ChromeOptions();
		chromeOptions.addArguments("--no-sandbox");//No I18N
		chromeOptions.addArguments("--headless");//No I18N
		chromeOptions.addArguments("--disable-dev-shm-usage");//No I18N
		RemoteWebDriver driver = new RemoteWebDriver(
				new URL("YOUR WEBDRIVER ENDPOINT"),
				chromeOptions);//No I18N
		 System.out.println("Launching..");
		 driver.get(url);
		 System.out.println("Get into the page..");

		 // Get All the Links from Anchor<a> Elements and check if there are any other pages with the contact information.
		 List<WebElement> allLinks =driver.findElements(By.tagName("a")); 
		    Set<String> link1 = new LinkedHashSet<String>();
		    String[] keywords = {"about", "contact", "support"};
			for(WebElement link: allLinks) {
				String links = link.getAttribute("href");
				if(links!=null) {
					if(links.startsWith("https:")){
						for(int i=0;i<keywords.length;i++) {
							if(links.contains(keywords[i]))
							link1.add(links);
						}
					}
				}
			}
		     System.out.println(link1);
			Set<String> contactsFound = checkIfAnyContacts(driver, url);
			for(String link:link1) {
				Set<String> newContactFound= checkIfAnyContacts(driver,link);
				contactsFound.addAll(newContactFound);
			}
			System.out.println("Found all contact details..");
			for(String contact : contactsFound) {
				System.out.println(contact);
			}
			driver.quit();
			
		
	}
	private static Set<String> checkIfAnyContacts(WebDriver driver, String s) {
		String[] anchorKeywords = { "tel:", "mailto:", "twitter", "facebook", "instagram", "youtube", "linkedin", "github" };
		List<WebElement> allLinks = driver.findElements(By.tagName("a")); 
	    Set<String> link1 = new LinkedHashSet<String>();
		for(WebElement link: allLinks) {
			String links = link.getAttribute("href");
			if(links!=null) {
				link1.add(links);
			}
		}
		Set<String> contacts= new LinkedHashSet<String>();
		for(String link : link1) {
			for(int i=0;i<anchorKeywords.length;i++) {
				if(link.contains(anchorKeywords[i])) {
					contacts.add(link);
				}
			}
		}
		Set<String> possibleTexts= new LinkedHashSet<String>();
		List<WebElement> allLink = driver.findElements(By.tagName("td, p, span, div")); 
		for(WebElement link: allLinks) {
			String links = link.getText();
			possibleTexts.add(links);	
		}
		
		for(String text:possibleTexts) {
			//email regex
			if(Pattern.matches( "/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g",text) && text!=" ")
				contacts.add(text);

			//mobile regex
			if(Pattern.matches( "/(\\+?[0-9-()+ ]{10,})/g",text) && text!= " ")
				contacts.add(text);
		}
		
		return contacts;
		

		
	}


		

}
