package testcase;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

public class GetContactsOfLead {

	public static void main(String[] args) throws IOException {

		String url = "https://www.manageengine.com/";
		try (Playwright playwright = Playwright.create()) {
			BrowserType browserType = playwright.chromium();

			
			Browser browser = browserType.connectOverCDP("YOUR CDP ENDPOINT");
			System.out.println("launching..");
			BrowserContext context = browser.newContext();
                        Page page = context.newPage();
			page.navigate(url);
			System.out.println("Get into the page..");
			
//All the anchor tags will be collected
			List<ElementHandle> allLinks =page.querySelectorAll("a");
		    Set<String> possibleLink = new LinkedHashSet<String>();
		    String[] keywords = {"about", "contact", "support"}; //Keywords
//The anchor tags that contain the Keywords will be filtered
			for(ElementHandle link: allLinks) {
				String links = link.getAttribute("href");
				if(links!=null) {
						for(int i=0;i<keywords.length;i++) {
							if(links.contains(keywords[i]))
								possibleLink.add(links);	
					}
				}
			}
			System.out.println("Scarpe all the link..");
			System.out.println(possibleLink);
			
			Set<String> contactsFound = checkIfAnyContacts(page, url); //All the contact information present in the inputted URL will be collected
			for(String link:possibleLink) {
				Set<String> newContactFound= checkIfAnyContacts(page,link); //All the contact information present in the filtered anchor tags that are collected in line 43 will be collected
				System.out.print(newContactFound);
				contactsFound.addAll(newContactFound);
			}
			System.out.println("Found all contact details..");
//All the scraped contact information will be collected
			for(String contact : contactsFound) {
				System.out.println(contact);
			}
			page.close();
			
		}
	}
	private static Set<String> checkIfAnyContacts(Page page, String s) {
		String[] anchorKeywords = { "tel:", "mailto:", "twitter", "facebook", "instagram", "youtube", "linkedin", "github" };
		List<ElementHandle> allLinks =page.querySelectorAll("a");
	    Set<String> link1 = new LinkedHashSet<String>();
		for(ElementHandle link: allLinks) {
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
		List<ElementHandle> allLink =page.querySelectorAll("td, p, span, div");
		for(ElementHandle link: allLink) {
			String links = link.textContent();
			possibleTexts.add(links);
			
			
		}
		
		for(String text:possibleTexts) {
			if(Pattern.matches( "/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})/g",text) && text!=" ")
				contacts.add(text);

			if(Pattern.matches( "/(\\+?[0-9-()+ ]{10,})/g",text) && text!= " ")
				contacts.add(text);
		}
		
		return contacts;
		

		
	}

}
