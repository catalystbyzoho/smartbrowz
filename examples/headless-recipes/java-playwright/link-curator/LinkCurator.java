package testcase;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

public class LinkCurator {


	public static void main(String[] args) throws IOException {
		String url = "https://catalyst.zoho.com";
		int fetchMax = 10;
		try (Playwright playwright = Playwright.create()) {

			BrowserType browsertype = playwright.chromium();
			Browser browser = browsertype.launch(new BrowserType.LaunchOptions());
			browsertype.connectOverCDP("YOUR CDP ENDPOINT");
			BrowserContext context = browser.newContext();
			Page page = context.newPage();
			System.out.println("Launching...");
			page.navigate(url);
			System.out.println("Get into the page..");
			
			// Collect all the anchor tags present in the webpage '<a></a>'
			List<ElementHandle> allLinks =page.querySelectorAll("a");

			// Remove duplicates and collect the first 10 hyperlinks
		      Set<String> link1 = new LinkedHashSet<String>();
			for(ElementHandle link: allLinks) {
				String links = link.getAttribute("href");
				System.out.println(links);
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
			System.out.println("Scarpe all the links");
			FileWriter writer = new FileWriter("Csv.csv");
     		Page page1 = context.newPage();
     		//Collect the page titles of the filtered hyperlinks and write it in a CSV file
				for(String s : link1) {
					String title = navigateToPageAndGetTitle(page1,s);
					writer.append("{Title: ");
					writer.append(title+" }");
					writer.append("\n");
					writer.append("{Hreflink: ");
					writer.append(s+" ");
					writer.append("\n");
					writer.append("\n");
				}
				System.out.println("File written");
				writer.close();
				page.close();
		}
	}

	private static String navigateToPageAndGetTitle(Page page, String s) {
		try {
			page.navigate(s);
			return page.title();
			
		}
		catch(Exception ex) {
			return "Title not found";
		}

		
	}

}