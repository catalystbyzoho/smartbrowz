package testcase;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Page.FillOptions;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.LoadState;

public class Marketplace {

	public static void main(String[] args) {
		String searchKeyword = "voice call";
		boolean paidAlso = true; //Change to false is you wish to ignore paid extensions
		String ratingGreaterThanOrEqualTo = "4"; // Allowed Values ["1", "2", "3", "4"]
		String deploymentType = "Zoho platform";  // Allowed Values ["Zoho platform", "Built-in integrations", "API-built integrations"]
		int fetchMax = 5;
		try (Playwright playwright = Playwright.create()) {
			String url ="https://marketplace.zoho.com/gsearch?" + "searchTerm=" + searchKeyword;

			BrowserType browsertype = playwright.chromium();
			
			Browser browser = browsertype.launch(new BrowserType.LaunchOptions());
			browsertype.connectOverCDP("YOUR CDP ENDPOINT");//No I18N
			BrowserContext context = browser.newContext();
			Page page = context.newPage();
			System.out.println("Launching...");
			page.navigate(url);
			System.out.println("Get into the page..");
			switch(ratingGreaterThanOrEqualTo) {
			case "1" : page.waitForSelector("//*[@id=\"rating-object\"]/div[4]").click(); break;
			case "2" : page.waitForSelector("//*[@id=\"rating-object\"]/div[3]").click(); break;
			case "3" : page.waitForSelector("//*[@id=\"rating-object\"]/div[2]").click(); break;
			case "4" : page.waitForSelector("//*[@id=\"rating-object\"]/div[1]").click(); break;
			default : break;
			}
			System.out.println("rated..");
			switch(deploymentType) {
			case "Zoho platform" :page.waitForSelector("//*[@id=\"13\"]/a").click(); break;
			case "Built-in integrations" :page.waitForSelector("//*[@id=\"14\"]/a") .click(); break;
			case "API-built integrations" :page.waitForSelector("//*[@id=\"15\"]/a").click(); break;
			default : break;
		}
			System.out.println("deployment type selected..");
			page.waitForSelector("//*[@id=\"pricing-object\"]/div[1]/div/label").click();   
			System.out.println("scarpe the extension links..");
			ElementHandle extensionlink = page.querySelector("div[id=extension-listed]");
			
			page.waitForLoadState(LoadState.NETWORKIDLE);
			List<ElementHandle> freeLinks =extensionlink.querySelectorAll("div[class='default-card-wrapper  dIB mR20 mB20 box-borderBx posrel w320']");
		    Set<String> extensionLinks = new LinkedHashSet<String>();
		    //Scrape the links of all free extensions
		    int count=0;
		    for (int j = 0; j < freeLinks.size(); j++) {
				String link = "https://marketplace.zoho.com"+freeLinks.get(j).waitForSelector("a[class='positionAbsolute t0 left0 r0']").getAttribute("href");
				extensionLinks.add(link);
				count++;
				if(count == fetchMax) { //Remove any duplicates if present, and store only the first 5 links
					count =0;
					break;
				}
				}
				//Scrape the links of all the paid extensions
		    if(paidAlso) {
				page.waitForSelector("//*[@id=\"pricing-object\"]/div[2]/div/label").click(); 
				ElementHandle paidExtensionLink = page.querySelector("div[id=extension-listed]");
				page.waitForLoadState(LoadState.NETWORKIDLE);
				List<ElementHandle> paidLinks =paidExtensionLink.querySelectorAll("div[class='default-card-wrapper  dIB mR20 mB20 box-borderBx posrel w320']");
				
				for (int i = 0; i < paidLinks.size(); i++) {
					count++;
			   String  link = "https://marketplace.zoho.com"+ paidLinks.get(i).waitForSelector("a[class='positionAbsolute t0 left0 r0']").getAttribute("href");
				extensionLinks.add(link);
				if(count == fetchMax) { //Collect the first 5 links of paid extensions after removing duplicates
					break;
				}
			}
			}
		    
		 
			System.out.println("Start to scarpe the extension page details..");
			ArrayList<HashMap<String, String>> finalResults = new ArrayList<HashMap<String, String>>();
			System.out.println(extensionLinks.size());
			for(String link : extensionLinks) {
				HashMap<String, String> map = scrapeExtensionPage(page, link);
				finalResults.add(map);
			} //Displays the details of the scrapped extensions
			for (HashMap<String, String> map : finalResults) {
				System.out.println("Title: " +map.get("title") + "\n" +"builtFor: "+ map.get("BuiltFor") + "\n" +"TagLine: " + map.get("tagline") + "\n" + "Rating: "+ map.get("rating") + "\n" + "Detailed Rating: "+ map.get("detailedRatings") + "\n" + "Short Description: "+map.get("shortDescription") + "\n" +"Key Features: "+ map.get("keyFeatures"));
				System.out.println();
			}
			
		}
		catch(Exception ex) {
			
			System.out.print(ex);
		}

	}
	
	
	
	
	
	private static HashMap<String,String> scrapeExtensionPage(Page page, String s) {
        page.navigate(s);
		HashMap<String, String> details = new HashMap();
		try {
			details.put("title",(page.waitForSelector("h1[class ='extn-title extensionTitle']")).innerHTML());
			ElementHandle builtFor = page.waitForSelector("span[class ='extn-tagline extn-content partnerTxt inline-middle']");
			details.put("builtFor",(builtFor.waitForSelector("a[class ='redirectVendor']")).innerHTML());
			details.put("tagline",(page.waitForSelector("p[class ='extn-tagline extn-content']")).innerHTML());      
			ElementHandle ratingInfo = page.querySelector("div[class ='shot-ratingInfo']");
			details.put("rating",(ratingInfo.querySelector("div[class ='extn-sub-head averageRatingCount']")).innerHTML());
			HashMap<String, String> detailRating = new HashMap();
			ElementHandle progress = page.querySelector("div[class ='rating-progress']");
			detailRating.put("fiveStar",(progress.querySelector("div[class ='fiveStar progressStar']")).innerText());
			detailRating.put("fourStar",(progress.querySelector("div[class ='fourStar progressStar']")).innerText());   
			detailRating.put("threeStar",(progress.querySelector("div[class ='threeStar progressStar']")).innerText());
			detailRating.put("twoStar",(progress.querySelector("div[class ='twoStar progressStar']")).innerText());
			detailRating.put("oneStar",(progress.querySelector("div[class ='oneStar progressStar']")).innerText());
			details.put("detailedRatings",detailRating.toString());
			details.put("shortDescription",(page.waitForSelector("p[class ='shortDescription extn-content']")).innerHTML());      
			
			
			ElementHandle feat = page.querySelector("ul[id ='keyfeature']");
			List<ElementHandle> keyFeaturesElements = feat.querySelectorAll("li");
			String keyFeat = "";
			for(int i=0;i<keyFeaturesElements.size();i++) {
				keyFeat += keyFeaturesElements.get(i).innerText();
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