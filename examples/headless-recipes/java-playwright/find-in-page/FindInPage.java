package testcase;
import java.nio.file.Paths;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

public class FindInPage {

	public static void main(String[] args) {
			String url ="https://www.zoho.com/en-in/terms.html"; //URL
			String search ="fees"; //Keyword
			try (Playwright playwright = Playwright.create()) {
				BrowserType browsertype = playwright.chromium();
				Browser browser = browsertype.launch(new BrowserType.LaunchOptions());	
				browsertype.connectOverCDP("YOUR CDP ENDPOINT");
				BrowserContext context = browser.newContext();
				System.out.println("Launching..");
            			Page page = context.newPage();
				page.navigate(url);
				System.out.println("Get into the page..");
				System.out.println("Searching...");

				//The location of the instances where the keyword is found in the input URL will be collected
				Locator searchedWord = page.locator("text = search");
				if(searchedWord.count()!=0) {
					System.out.println("Word found..");
				}
				else {
					System.out.println("Word not found..");
				}
				int count =0;
				//Screenshots of the collected locations will be taken.
				for(int i=0;i<searchedWord.count();i++)
				{
					searchedWord.nth(i).screenshot(new Locator.ScreenshotOptions().setPath(Paths.get("shot"+count+".png")));
					count++;
				}	
				if(count>0)
					System.out.println("Screenshot Taken..");
				}
			catch(Exception ex) {
				System.out.print(ex);
			}
			page.close();

	}

}