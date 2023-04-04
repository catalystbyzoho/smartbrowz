const playwright = require('playwright');
const url = "https://polls-766644477.development.catalystserverless.com/app/";
(async () => {
  const browser = await playwright.chromium.connectOverCDP({
    wsEndpoint: 'YOUR CDP-ENDPOINT',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });

  console.log("launching..")
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 50000000 });
    console.log("get into the page");
    await page.waitForSelector("a.pollapp-button[href='#login']")
    await page.click("a.pollapp-button[href='#login']")
    const frameHandle = await page.waitForSelector('iframe')
    const frame = await frameHandle.contentFrame()
    await frame.waitForSelector("input[name='username']")
    await frame.type("input[name='username']", 'YOUR USERNAME')
    await frame.waitForSelector("input[name='password']")
    await frame.type("input[name='password']", 'YOUR PASSWORD')
    await frame.click("input[type='submit']")
    console.log("Successfully logged in..")
    await page.click('button:has-text("Create Poll")', {
      waitUntil: 'load',
      timeout: 5000
    });
    console.log("Starts to create poll")
    await page.waitForSelector("#QuestionContent");
    await page.type("input[name='QuestionContent']", "Which is your favourite programming language");
    await page.waitForSelector("#Option1Content");
    await page.type("input[name='Option1Content']", "nodejs");

    await page.waitForSelector("#Option2Content");
    await page.type("input[name='Option2Content']", "java");

    await page.waitForSelector("#Option3Content");
    await page.type("input[name='Option3Content']", "python");

    await page.waitForSelector("#Option4Content");
    await page.type("input[name='Option4Content']", "c");

    await page.locator('select#Category').selectOption({ label: 'Tv' });

    await page.waitForSelector("#Duration");
    await page.type("input[type='datetime-local']", "20082023")
    await page.keyboard.press('Tab');
    await page.type("input[type='datetime-local']", "0650AM")

    await page.click('button:has-text("Create Poll")');
    const ele = await page.waitForSelector('#displayContent > div > div.mB30 > h4');
    if (ele.length === 0) {
      console.log("Failed to create");
    }
    console.log("Poll created successfully");
    browser.close();

  }
  catch (e) {
    console.log("Failed to create poll" + e)
  }

})()