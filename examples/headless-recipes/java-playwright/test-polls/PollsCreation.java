package testcase;

import java.util.List;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.ElementHandle;
import com.microsoft.playwright.Frame;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.SelectOption;


public class polls 
{
    public static void main( String[] args )
    {
        try (Playwright playwright = Playwright.create()) {
                BrowserType browsertype = playwright.chromium();
                Browser browser = browsertype.launch(new BrowserType.LaunchOptions());
                BrowserContext context = browser.newContext();
                browsertype.connectOverCDP("YOUR CDP ENDPOINT");
                Page page = context.newPage();
                
                System.out.println("launching..");
                page.navigate("ENTER THE APPLICATION URL OF THE CATALYST DEMO POLLS APP");
                page.waitForSelector("a.pollapp-button[href='#login']").click();
                ElementHandle frameHandle = page.waitForSelector("iframe");
                Frame frame = frameHandle.contentFrame();
                
                System.out.println("Enter into the frame..");
                frame.waitForSelector("input[name='username']");
                frame.type("input[name='username']", "YOUR EMAILID");

                frame.waitForSelector("input[name='password']");
                frame.type("input[name='password']", "YOUR PASSWORD");                

                page.waitForNavigation(()->{
                    frame.waitForSelector("input[type='submit']").click();
                });
                
                System.out.println("Successfully logged in..");

                page.waitForSelector("#displayContent > div > div.row.mB20 > div.col-lg-5.text-right.d-flex.align-items-center.justify-content-end > button").click();
                
                System.out.println("Start to create poll..");
                
                page.waitForSelector("#QuestionContent");
                page.type("input[name='QuestionContent']","Which is your preffered programming language");
                
                page.waitForSelector("#Option1Content");
                page.type("input[name='Option1Content']","nodejs");
                
                page.waitForSelector("#Option2Content");
                page.type("input[name='Option2Content']","java");
                
                page.waitForSelector("#Option3Content");
                page.type("input[name='Option3Content']","python");
                
                page.waitForSelector("#Option4Content");
                page.type("input[name='Option4Content']","c");
                
                Locator options = page.locator("#Category");
                options.selectOption(new SelectOption().setLabel("Tv"));
                
                page.waitForSelector("#Duration");
                page.type("input[type='datetime-local']","09092023");
                page.keyboard().press("Tab");
                page.type("input[type='datetime-local']","0950AM");
                
                System.out.println("kk");
                page.waitForSelector("#savePoll").click();
                page.waitForSelector("//*[@id=\"displayContent\"]/div/div[1]/h4");
              
                System.out.print("Your poll has been successfully created");
              
                
            } catch (Exception e) {
                System.out.println("Failed to create a poll");
                e.printStackTrace();
            }
    }
}