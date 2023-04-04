const puppeteer = require('puppeteer')
  ; (async () => {

    const browser = await puppeteer.connect({
      browserWSEndpoint:  'YOUR CDP ENDPOINT',
      args: ['--no-sandbox', '--disable-dev-shm-usage','--incognito']
        });
    

    try {
      const page = await browser.newPage();
      console.log("launching..")
      const url = "https://polls-766644477.development.catalystserverless.com/app/";
      await page.goto(url, { waitUntil: "networkidle0", timeout: 50000000 });
      console.log("Get into the page..")
      await page.click("a.pollapp-button[href='#login']")
      const frameHandle = await page.waitForSelector('iframe');
      const frame = await frameHandle.contentFrame()
      await frame.type("input[name='username']", 'YOUR USERNAME')
      await frame.waitForSelector("input[name='password']")
      await frame.type("input[name='password']", 'YOUR PASSWORD')
      await frame.click("input[type='submit']")
      console.log("Successfully logged in..")

      await page.click("#displayContent > div > div.row.mB20 > div.col-lg-5.text-right.d-flex.align-items-center.justify-content-end > button");
      console.log("Start to create poll..")
      
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

      await page.select('#Category', 'Tv')

      await page.waitForSelector("#Duration");
      await page.type("input[type='datetime-local']", "08102023")
      await page.keyboard.press('Tab');
      await page.type("input[type='datetime-local']", "50AM")

      await page.click("#savePoll > span > span:nth-child(1)");
      if (await page.waitForXPath('//*[contains(text(), "Your poll has been successfully created")]')) {
        console.log("Poll created successfully")
      }

      else {
        console.log("Failed to create poll");
      }
      await browser.close();

    }

    catch (e) {
      console.log("Failed to create poll" + e);
    }


  })()