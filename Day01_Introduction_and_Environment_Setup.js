// ================================================================================
//          DAY 1 - INTRODUCTION TO PLAYWRIGHT & ENVIRONMENT SETUP
//          Playwright Complete Training | Phase 1: Foundation
// ================================================================================
// Duration   : 3-4 Hours
// Difficulty : Beginner
// Prerequisites: Basic knowledge of HTML, JavaScript
// ================================================================================

// ────────────────────────────────────────────────────────────────────────────────
//  TABLE OF CONTENTS
// ────────────────────────────────────────────────────────────────────────────────
//  1.  What is Playwright? History and Evolution
//  2.  Playwright vs Selenium vs Cypress vs WebdriverIO
//  3.  Playwright Architecture (How it Works Internally)
//  4.  Supported Browsers
//  5.  Supported Languages
//  6.  Installing Node.js and VS Code
//  7.  Installing Playwright (Step-by-Step)
//  8.  Project Structure Walkthrough
//  9.  playwright.config.js - Complete Explanation
//  10. Running Your First Test
//  11. Playwright CLI Commands Overview
//  12. Playwright Test Runner vs Standalone Library
//  13. Headless vs Headed Mode
//  14. Real-Time Scenario
//  15. Interview Questions with Answers
//  16. MCQ Quiz (10 Questions)
//  17. Hands-on Assignment
// ────────────────────────────────────────────────────────────────────────────────




// ================================================================================
//  SECTION 1: WHAT IS PLAYWRIGHT? HISTORY & EVOLUTION
// ================================================================================

/*
  DEFINITION:
  -----------
  Playwright is an open-source, cross-browser end-to-end testing framework
  developed and maintained by Microsoft. It allows you to write tests that
  can automate browser interactions across Chromium, Firefox, and WebKit
  using a single, unified API.
*/

/*
  HISTORY & EVOLUTION:
  --------------------
  2014 - PhantomJS      : First headless browser for automation (now abandoned)
  2015 - NightmareJS    : Based on Electron, used for automation
  2016 - Puppeteer      : Google launched Puppeteer for Chrome/Chromium only
  2018 - Cypress        : JavaScript-only, in-browser execution model launched
  2020 - Playwright v1  : Microsoft launched Playwright (Jan 2020)
                          Original team came from Puppeteer (Google → Microsoft)
  2021 - Playwright Test: Dedicated test runner (@playwright/test) released
  2022 - Component Testing added (React, Vue, Svelte)
  2023 - Playwright UI Mode, new Locator API, and Codegen improvements
  2024 - Playwright MCP (AI-assisted testing with Model Context Protocol)

  KEY FACT: Playwright was built by the same engineers who originally
  created Puppeteer at Google, then moved to Microsoft.
*/

/*
  WHY PLAYWRIGHT WAS CREATED:
  ----------------------------
  Problems it solves over older tools:
  ✔ Cross-browser support in ONE tool (Chrome + Firefox + Safari)
  ✔ No flaky tests due to built-in auto-waiting   ← see deep explanation below
  ✔ Network interception without extra tools
  ✔ Multi-tab, multi-window, multi-origin support
  ✔ Works with modern web frameworks (React, Angular, Vue, etc.)
  ✔ Built-in JavaScript/TypeScript support (no config needed)
  ✔ Parallel test execution out of the box
*/


// ================================================================================
//  CONCEPT DEEP DIVE: WHAT IS A "FLAKY TEST"?
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DEFINITION:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A FLAKY TEST is a test that:
    ✗ PASSES sometimes  and  FAILS sometimes
    ✗ Even though the APPLICATION CODE has NOT changed
    ✗ The test result is INCONSISTENT / UNRELIABLE / UNPREDICTABLE

  Real-world analogy:
    Imagine a light switch that works 7 out of 10 times.
    You flip it — sometimes light comes ON, sometimes it doesn't.
    The switch is "flaky". Same with tests.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHY DO FLAKY TESTS HAPPEN?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  The #1 cause: TIMING ISSUES (Race Conditions)

  The test code runs FASTER than the browser can render the page.
  The test tries to click a button that has NOT appeared on screen yet.
  Result → ElementNotFound error → TEST FAILS

  Other causes of flaky tests:
  ✗ Hard-coded sleep/wait times  (sleep(2000) — too short on slow machine)
  ✗ Network latency variation    (API takes 1s today, 4s tomorrow)
  ✗ Animation not finished       (button moves while test tries to click)
  ✗ Dynamic content loading      (content loads via AJAX after page loads)
  ✗ Shared test data conflicts   (parallel tests using same user account)
  ✗ Memory/CPU spikes on CI      (machine is slow → timeouts)
*/


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 1: FLAKY TEST (Selenium / old style — BAD practice)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
  SCENARIO:
  User clicks "Login" → page shows a loading spinner → then shows Dashboard.
  Test must click "Welcome" button on the Dashboard.

  PROBLEM: The test clicks "Welcome" button BEFORE the Dashboard has loaded.
*/

// ❌ FLAKY TEST — using hard-coded sleep (Selenium / old style)
// This is pseudo-code showing what OLD automation looked like

// driver.get("https://app.example.com/login");
// driver.findElement(By.id("username")).sendKeys("admin");
// driver.findElement(By.id("password")).sendKeys("pass123");
// driver.findElement(By.id("login-btn")).click();
//
// Thread.sleep(2000);   // ← PROBLEM! Hard-coded 2 second wait
//                       // What if login takes 3 seconds on a slow day?
//                       // Test FAILS!  ← FLAKY
//                       // What if login takes 0.5 seconds on a fast day?
//                       // We wasted 1.5 seconds. ← SLOW
//
// driver.findElement(By.id("welcome-btn")).click();   // May fail! Button not ready
// assertEquals("Dashboard", driver.getTitle());


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 2: STILL FLAKY — using explicit waits (Selenium — better but risky)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ⚠️  STILL FRAGILE — Selenium explicit wait (pseudo-code)
// wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome-btn")));
// driver.findElement(By.id("welcome-btn")).click();
//
// PROBLEM: Element is VISIBLE but still animating (sliding in).
// Clicking during animation → click lands on wrong position → FLAKY


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 3: RELIABLE TEST — Playwright auto-waiting (GOOD practice) ✅
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: flakydemoTest, expect: flakydemoExpect } = require('@playwright/test');

flakydemoTest('login and click welcome button — NO flakiness', async ({ page }) => {
  await page.goto('https://app.example.com/login');

  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('pass123');
  await page.locator('#login-btn').click();

  // ✅ NO sleep needed!
  // Playwright AUTOMATICALLY waits for #welcome-btn to be:
  //   → attached to DOM
  //   → visible on screen
  //   → not covered by another element
  //   → not animating / stable
  //   → enabled (not disabled)
  // ONLY THEN does Playwright click it.

  await page.locator('#welcome-btn').click();   // ← auto-wait built in!

  await flakydemoExpect(page).toHaveTitle('Dashboard');
  // ↑ Also auto-waits — retries assertion until title matches or timeout
});

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW PLAYWRIGHT AUTO-WAITING WORKS INTERNALLY:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  When you call:  await page.locator('#btn').click()

  Playwright does NOT click immediately.
  It runs "ACTIONABILITY CHECKS" in a loop until ALL pass:

  ┌─────────────────────────────────────────────────────────┐
  │           ACTIONABILITY CHECKS (auto-waiting)            │
  ├──────────────┬──────────────────────────────────────────┤
  │  ATTACHED    │ Element exists in the DOM                 │
  │  VISIBLE     │ Element is visible (not display:none)     │
  │  STABLE      │ Element is not moving / animating         │
  │  ENABLED     │ Element is not disabled                   │
  │  EDITABLE    │ (for fill) Element accepts text input     │
  │  RECEIVES    │ Element is not covered by another element │
  │  EVENTS      │                                           │
  └──────────────┴──────────────────────────────────────────┘

  It keeps checking every few milliseconds until all conditions pass
  OR until the timeout is reached (default: 30 seconds).

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  REAL-WORLD FLAKY TEST SCENARIOS & HOW PLAYWRIGHT SOLVES THEM:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SCENARIO 1 — Button appears after API call:
  ─────────────────────────────────────────────
  Old way:  sleep(3000)  then click  → FLAKY (too short or too long)
  Playwright: await page.locator('#submit').click()
              → waits automatically until button appears and is clickable ✅

  SCENARIO 2 — Dropdown populates after fetch:
  ─────────────────────────────────────────────
  Old way:  click dropdown, sleep(2000), select option → FLAKY
  Playwright: await page.locator('#city').selectOption('Mumbai')
              → waits for option to exist in dropdown automatically ✅

  SCENARIO 3 — Success message after form submit:
  ─────────────────────────────────────────────────
  Old way:  submit form, sleep(1000), check text → FLAKY
  Playwright: await expect(page.locator('.success')).toHaveText('Saved!')
              → retries assertion every 100ms until text appears ✅

  SCENARIO 4 — Page navigation after button click:
  ──────────────────────────────────────────────────
  Old way:  click, sleep(2000), check URL → FLAKY
  Playwright: await page.locator('#go').click()
              await expect(page).toHaveURL('/dashboard')
              → both auto-wait for navigation to complete ✅

  SCENARIO 5 — Table loads data from API:
  ─────────────────────────────────────────
  Old way:  sleep(3000), count rows → FLAKY (varies by network)
  Playwright: await expect(page.locator('table tr')).toHaveCount(10)
              → retries count assertion until table is fully loaded ✅

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SUMMARY — FLAKY vs RELIABLE:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Problem                     | Old Tools (Selenium)   | Playwright
  ----------------------------|------------------------|-------------------------
  Button not ready yet        | Test FAILS (flaky)     | Auto-waits → PASSES ✅
  Page still loading          | sleep(2000) hardcoded  | Auto-waits for load ✅
  Animation in progress       | Clicks wrong position  | Waits for stability ✅
  API response not arrived    | sleep(3000) guesswork  | Retries assertion ✅
  Element hidden then visible | Fails randomly         | Waits for visibility ✅
  Disabled button             | StaleElementException  | Waits for enabled ✅

  KEY INSIGHT FOR INTERVIEWS:
  ────────────────────────────
  "Flaky" = test result is non-deterministic.
  Same code, same app, run 10 times → 7 pass, 3 fail. That's flaky.

  Playwright eliminates most flakiness because EVERY action and EVERY
  assertion has auto-waiting built into the core engine — not bolted on
  as an afterthought like in Selenium.
*/




// ================================================================================
//  SECTION 2: PLAYWRIGHT vs SELENIUM vs CYPRESS vs WEBDRIVERIO
// ================================================================================

/*
  COMPARISON TABLE:
  -----------------

  Feature                  | Playwright        | Selenium          | Cypress           | WebdriverIO
  -------------------------|-------------------|-------------------|-------------------|------------------
  Year Released            | 2020              | 2004              | 2015              | 2012
  Maintained by            | Microsoft         | Community/LF      | Cypress.io        | Community
  Languages Supported      | JS/TS/Python/     | Java/Python/      | JS/TS only        | JS/TS only
                           | Java/C#           | C#/Ruby/JS        |                   |
  Browser Support          | Chrome,Firefox,   | All major browsers| Chrome,Firefox,   | All major browsers
                           | Safari (WebKit)   | via drivers       | Edge,Electron     | via WebDriver
  Execution Model          | CDP + WebSocket   | WebDriver Protocol| In-browser        | WebDriver/CDP
  Auto-Waiting             | YES (built-in)    | NO (manual waits) | YES (limited)     | NO (manual)
  Network Interception     | YES (built-in)    | With BrowserMob   | YES               | With plugins
  Parallel Testing         | YES (built-in)    | Selenium Grid     | YES (paid)        | YES
  iFrame Support           | YES               | YES               | Limited           | YES
  Multi-Tab Support        | YES               | YES               | NO                | YES
  Cross-Origin (iframes)   | YES               | Limited           | Limited           | YES
  Mobile Emulation         | YES (built-in)    | Appium            | Limited           | Appium
  API Testing              | YES (built-in)    | NO                | YES (cy.request)  | With plugins
  Visual Testing           | YES (built-in)    | With Applitools   | With plugins      | With plugins
  Test Runner              | @playwright/test  | TestNG/JUnit      | Built-in          | Mocha/Jasmine
  CI/CD Integration        | Excellent         | Good              | Good              | Good
  Community Support        | Growing Fast      | Very Large        | Large             | Medium
  License                  | Apache 2.0        | Apache 2.0        | MIT               | MIT
  Speed                    | Very Fast         | Slow              | Fast              | Medium
  Learning Curve           | Medium            | Medium-High       | Low-Medium        | Medium
  Price                    | Free              | Free              | Free/Paid         | Free
*/

/*
  WHEN TO CHOOSE PLAYWRIGHT:
  ---------------------------
  ✔ New project starting fresh
  ✔ Need cross-browser testing including Safari (WebKit)
  ✔ Team knows JavaScript or TypeScript
  ✔ Need powerful network mocking   ← see deep explanation below
  ✔ Want fast, reliable, parallel execution
  ✔ Modern web apps (SPAs, React, Angular, Vue)

  WHEN TO CHOOSE SELENIUM:
  -------------------------
  ✔ Legacy enterprise projects already using Selenium
  ✔ Team uses Java/Python heavily
  ✔ Need real device testing via Appium
  ✔ Complex distributed Selenium Grid setup already exists
*/


// ================================================================================
//  CONCEPT DEEP DIVE: WHAT IS "NETWORK MOCKING"?
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DEFINITION:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Network Mocking = INTERCEPTING the browser's HTTP requests and
  returning FAKE (controlled) responses instead of hitting the real server.

  Real-world analogy:
    You order food online. The delivery boy (browser request) is heading
    to the restaurant (real API server). You STOP the delivery boy midway
    and give him a packed lunch from your own kitchen (fake response).
    The customer (UI) receives food and is happy — never knew the difference.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHY DO WE NEED NETWORK MOCKING IN TESTING?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Problem 1 — Backend API is not ready yet:
    Frontend team builds the UI but the backend is still in development.
    Mock the API → test the UI logic NOW without waiting for backend.

  Problem 2 — Hard to reproduce edge cases via real API:
    How do you test "What happens when the API returns 500 error?"
    You can't ask your server to fail on purpose in a test!
    Mock the API → return 500 → test the error handling UI.

  Problem 3 — API calls are slow or rate-limited:
    Payment gateway API takes 5 seconds. Runs 50 tests = 4 minutes wasted.
    Mock the payment API → instant response → fast tests.

  Problem 4 — Test data is unpredictable from real API:
    Real product API returns different prices, stock levels every day.
    Mock it → always return exactly what you need → stable assertions.

  Problem 5 — Third-party APIs (Google, Stripe, Twilio):
    Cannot call real Stripe in tests → charges real money!
    Cannot call real Twilio → costs money per SMS.
    Mock them → free, fast, controlled.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  THE 4 THINGS PLAYWRIGHT CAN DO WITH NETWORK REQUESTS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. INTERCEPT   → Catch the request before it leaves the browser
  2. FULFILL     → Return a fake response (mock) — real server never called
  3. ABORT       → Block the request completely (e.g., block ads/trackers)
  4. MODIFY      → Let request go to real server but change the response
*/


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 1: FULFILL — Return fake JSON data (most common use case)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: mockTest1, expect: mockExpect1 } = require('@playwright/test');

mockTest1('show products from MOCKED API — no real server needed', async ({ page }) => {

  // STEP 1: Intercept the products API call and return fake data
  await page.route('**/api/products', async (route) => {
    // This fake JSON is returned instead of hitting the real server
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Laptop',  price: 999,  inStock: true  },
        { id: 2, name: 'Phone',   price: 499,  inStock: true  },
        { id: 3, name: 'Tablet',  price: 299,  inStock: false },
      ]),
    });
    // ↑ Real server is NEVER called. Response is instant.
  });

  // STEP 2: Navigate to the page that calls the API
  await page.goto('https://myshop.com/products');

  // STEP 3: Assert the UI renders the mocked data correctly
  await mockExpect1(page.locator('.product-name').first()).toHaveText('Laptop');
  await mockExpect1(page.locator('.product-price').first()).toContainText('999');
  await mockExpect1(page.locator('.product-card')).toHaveCount(3);
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 2: FULFILL with ERROR — Test how UI handles API failures
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: mockTest2, expect: mockExpect2 } = require('@playwright/test');

mockTest2('show error message when API returns 500', async ({ page }) => {

  // Force the API to return a server error
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
    // Try getting a real server to fail on purpose... impossible!
    // With mocking, you simulate ANY error scenario instantly.
  });

  await page.goto('https://myshop.com/products');

  // Verify the UI shows the error message (not crash or blank page)
  await mockExpect2(page.locator('.error-banner')).toBeVisible();
  await mockExpect2(page.locator('.error-banner')).toContainText('Something went wrong');
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 3: ABORT — Block specific requests (ads, trackers, images)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: mockTest3 } = require('@playwright/test');

mockTest3('block all image requests to make tests run faster', async ({ page }) => {

  // Abort every request for an image file
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', async (route) => {
    await route.abort();
    // Images are blocked → page loads faster → tests run faster
    // UI logic still tested (buttons, forms, text) — images not needed
  });

  // Also block third-party analytics and tracking scripts
  await page.route('**/*google-analytics*', async (route) => await route.abort());
  await page.route('**/*hotjar*',           async (route) => await route.abort());

  await page.goto('https://myshop.com');
  // Page loads WITHOUT images and trackers → 2x-3x faster load
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 4: MODIFY — Let real request go, then change the response
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: mockTest4, expect: mockExpect4 } = require('@playwright/test');

mockTest4('real API call but inject extra product in response', async ({ page }) => {

  await page.route('**/api/products', async (route) => {
    // Step 1: Let the REAL API call go through
    const realResponse = await route.fetch();

    // Step 2: Read the real response body
    const realData = await realResponse.json();

    // Step 3: Modify it — inject an extra product
    realData.push({ id: 99, name: 'Test Product', price: 1, inStock: true });

    // Step 4: Return modified response to the browser
    await route.fulfill({
      response: realResponse,
      body: JSON.stringify(realData),
    });
  });

  await page.goto('https://myshop.com/products');

  // The UI now shows the real products PLUS our injected test product
  await mockExpect4(page.locator('.product-card').last()).toContainText('Test Product');
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 5: WAIT FOR — Verify a specific API call was actually made
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { test: mockTest5, expect: mockExpect5 } = require('@playwright/test');

mockTest5('verify Add to Cart button triggers correct API call', async ({ page }) => {

  await page.goto('https://myshop.com/products');

  // Wait for a SPECIFIC network request to happen after button click
  const cartApiCallPromise = page.waitForRequest(
    (request) =>
      request.url().includes('/api/cart') &&   // URL contains /api/cart
      request.method() === 'POST'              // Method is POST
  );

  // Click the Add to Cart button
  await page.locator('[data-testid="add-to-cart-btn"]').click();

  // Wait for the API call and capture it
  const cartRequest = await cartApiCallPromise;

  // Assert the request body contains the right product ID
  const requestBody = cartRequest.postDataJSON();
  mockExpect5(requestBody.productId).toBe(1);
  mockExpect5(requestBody.quantity).toBe(1);
  // ↑ This proves the frontend sent the correct data to the backend
});


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NETWORK MOCKING — COMPLETE REFERENCE:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Method                       | What it does
  ─────────────────────────────|───────────────────────────────────────────────
  page.route(url, handler)     | Intercept requests matching the URL pattern
  route.fulfill({...})         | Return a fake response (mock) to the browser
  route.abort()                | Block the request completely (no response)
  route.continue()             | Allow request to go to real server unchanged
  route.fetch()                | Send to real server, get response to modify
  page.waitForRequest(fn)      | Wait for a request matching a condition
  page.waitForResponse(fn)     | Wait for a response matching a condition
  page.on('request', fn)       | Listen to ALL outgoing requests
  page.on('response', fn)      | Listen to ALL incoming responses
  ─────────────────────────────|───────────────────────────────────────────────

  // URL PATTERN MATCHING:
  // ──────────────────────
  // '**/api/products
  // '**/api/**'                   → matches any URL with /api/ in the path
  // '**/*.json'                   → matches any URL requesting a .json file
  // /api\/products\/\d+/          → regex: matches /api/products/123
  // 'https://exact.com/path'      → exact URL match

//   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   REAL-TIME USE CASES IN PROJECTS:
//   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//   ✔ E-commerce    : Mock payment gateway (Stripe/PayPal) — no real charges
//   ✔ Banking       : Mock balance API — test UI with specific amounts
//   ✔ Social media  : Mock feed API — test UI with controlled post content
//   ✔ Error testing : Force 401/403/500 errors — verify error UI components
//   ✔ Speed         : Block images/analytics — 50-70% faster test execution
//   ✔ Offline mode  : Mock all APIs — test works without internet
//   ✔ CI/CD         : No dependency on external APIs — tests always pass

//   INTERVIEW ANSWER — "What is network mocking in Playwright?":
//   ─────────────────────────────────────────────────────────────
//   Network mocking in Playwright uses page.route() to intercept browser
//   HTTP requests and return controlled fake responses using route.fulfill().
//   This allows testing UI behaviour without depending on real backend APIs.
//   Use cases include: testing error states (500 errors), testing with
//   specific data sets, blocking slow third-party APIs, and testing frontend
//   logic when backend is still in development.
// */




// ================================================================================
//  SECTION 3: PLAYWRIGHT ARCHITECTURE (HOW IT WORKS INTERNALLY)
// ================================================================================

/*
  HIGH-LEVEL ARCHITECTURE:
  -------------------------

  ┌─────────────────────────────────────────────────────────┐
  │                    YOUR TEST CODE                        │
  │              (TypeScript / JavaScript)                   │
  └────────────────────────┬────────────────────────────────┘
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │              PLAYWRIGHT TEST RUNNER                      │
  │           (@playwright/test framework)                   │
  │  - Test scheduling    - Parallel workers                 │
  │  - Fixtures           - Reporters                        │
  └────────────────────────┬────────────────────────────────┘
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │             PLAYWRIGHT NODE.JS LIBRARY                   │
  │         (High-level browser automation API)              │
  └────────────┬───────────────┬───────────────┬────────────┘
               │               │               │
               ▼               ▼               ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  CHROMIUM    │   │   FIREFOX    │   │   WEBKIT     │
  │  (Chrome,    │   │  (Firefox)   │   │  (Safari)    │
  │   Edge)      │   │              │   │              │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                  │                  │
         ▼                  ▼                  ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  CDP Protocol│   │  Firefox     │   │  WebKit      │
  │  (DevTools   │   │  Remote      │   │  Inspector   │
  │   Protocol)  │   │  Protocol    │   │  Protocol    │
  └──────────────┘   └──────────────┘   └──────────────┘
*/

/*
  HOW IT WORKS STEP BY STEP:
  ----------------------------
  Step 1 → Your test code calls Playwright APIs  e.g. page.click()
  Step 2 → Playwright Node.js library translates this into browser commands
  Step 3 → Commands are sent over WebSocket connection to the browser
  Step 4 → Browser executes the command using its native protocol:
              - Chromium/Edge : Chrome DevTools Protocol (CDP)
              - Firefox       : Firefox Remote Protocol
              - WebKit        : WebKit Inspector Protocol
  Step 5 → Browser returns results back over WebSocket
  Step 6 → Playwright processes results and your test continues

  KEY ARCHITECTURAL ADVANTAGES:
  --------------------------------
  ✔ Out-of-process    : Browser is a separate process — test crashes won't
                        affect the browser and vice versa
  ✔ WebSocket         : Faster than HTTP used by older WebDriver (Selenium)
  ✔ Context isolation : Each test gets its own browser context (like incognito)
                        = no test pollution between tests
  ✔ Multiple pages    : Efficient tab management within one context
  ✔ Auto-waiting      : Built into the protocol layer — Playwright knows
                        exact browser state at all times

  PLAYWRIGHT vs WEBDRIVER PROTOCOL:
  ------------------------------------
  WebDriver (Selenium)           |  CDP / Playwright Protocol
  -------------------------------|-----------------------------------
  HTTP REST API                  |  WebSocket (bidirectional)
  One command at a time          |  Multiple commands simultaneously
  Browser must wait for each req |  Event-driven, real-time updates
  External driver needed         |  Direct browser communication
  (chromedriver, geckodriver)    |  No external drivers needed
*/




// ================================================================================
//  SECTION 4: SUPPORTED BROWSERS
// ================================================================================

/*
  Browser          | Engine      | Playwright Name          | Notes
  -----------------|-------------|--------------------------|-------------------------
  Google Chrome    | Chromium    | 'chromium'               | Uses bundled Chromium
  Microsoft Edge   | Chromium    | channel: 'msedge'        | Uses installed Edge
  Mozilla Firefox  | Gecko       | 'firefox'                | Uses bundled Firefox
  Apple Safari     | WebKit      | 'webkit'                 | Uses WebKit engine

  IMPORTANT NOTES:
  ----------------
  ✔ Playwright bundles its OWN versions of Chromium and Firefox
    (does NOT use your system's installed browsers by default)
  ✔ WebKit is NOT Safari itself — but the same rendering engine
  ✔ To use your system's Chrome  → channel: 'chrome'   in config
  ✔ To use your system's Edge   → channel: 'msedge'  in config

  WHY BUNDLED BROWSERS?
  ----------------------
  ✔ Consistent behavior across all developer machines and CI servers
  ✔ No dependency on system browser updates breaking your tests
  ✔ Tests are 100% reproducible everywhere
*/




// ================================================================================
//  SECTION 5: SUPPORTED LANGUAGES
// ================================================================================

/*
  Language       | Package                    | Min Version
  ---------------|----------------------------|------------------
  JavaScript     | @playwright/test           | Node.js 14+
  TypeScript     | @playwright/test           | Node.js 14+ (built-in support)
  Python         | playwright  (via pip)      | Python 3.8+
  Java           | playwright  (Maven/Gradle) | Java 8+
  C# / .NET      | Microsoft.Playwright       | .NET 6+

  ► For this training: We use JAVASCRIPT (beginner-friendly, no compilation step)

  Why JavaScript for this training?
  ✔ No compilation needed — write and run tests immediately
  ✔ Easier for beginners — no type annotations to learn upfront
  ✔ Full Playwright support — 100% of features work in JavaScript
  ✔ Massive community, tutorials, and Stack Overflow answers available
  ✔ Can migrate to TypeScript later once comfortable with Playwright
*/




// ================================================================================
//  SECTION 6: INSTALLING NODE.JS AND VS CODE
// ================================================================================

// ─── STEP 1: Install Node.js ───────────────────────────────────────────────────
/*
  1. Go to: https://nodejs.org
  2. Download LTS version (Long Term Support) — e.g. 20.x or 22.x
  3. Run the installer (Next → Next → Finish)
  4. Verify installation — open Terminal/PowerShell and run:
*/

// Verify Node.js version (run in terminal):
// node --version
// Expected output: v20.x.x

// Verify npm version (run in terminal):
// npm --version
// Expected output: 10.x.x


// ─── STEP 2: Install VS Code ───────────────────────────────────────────────────
/*
  1. Go to: https://code.visualstudio.com
  2. Download and install for your OS (Windows/Mac/Linux)
  3. Install these VS Code Extensions (Ctrl+Shift+X to open Extensions):

     ★ "Playwright Test for VSCode"  by Microsoft  ← MOST IMPORTANT
     ★ "ESLint"                      by Microsoft
     ★ "Prettier - Code Formatter"
     ★ "GitLens"                     (optional but very useful)
*/


// ─── STEP 3: Install Git ───────────────────────────────────────────────────────
/*
  1. Download from: https://git-scm.com
  2. Run installer with default options
  3. Verify: git --version
*/




// ================================================================================
//  SECTION 7: INSTALLING PLAYWRIGHT (STEP-BY-STEP)
// ================================================================================

// ─── METHOD 1: npm init (RECOMMENDED for new projects) ────────────────────────

// Step 1: Create a project folder (run in terminal)
// mkdir playwright-training
// cd playwright-training

// Step 2: Initialize Playwright project (run in terminal)
// npm init playwright@latest

/*
  Step 3: Answer the interactive prompts:
  ──────────────────────────────────────────────────────────────
  ? Do you want to use TypeScript or JavaScript?    → JavaScript
  ? Where to put your end-to-end tests?             → tests
  ? Add a GitHub Actions workflow?                   → true (Yes)
  ? Install Playwright browsers?                     → true (Yes)
  ──────────────────────────────────────────────────────────────

  Step 4: Wait for installation — this will automatically:
  ✔ Create package.json
  ✔ Install @playwright/test package
  ✔ Download Chromium, Firefox, WebKit browsers (~300MB)
  ✔ Create sample test files
  ✔ Create playwright.config.js
  ✔ Create GitHub Actions workflow (if selected)
*/


// ─── METHOD 2: Manual Installation ────────────────────────────────────────────

// Initialize npm project
// npm init -y

// Install Playwright test runner
// npm install -D @playwright/test

// Install ALL browsers (Chromium, Firefox, WebKit)
// npx playwright install

// Install only a specific browser
// npx playwright install chromium
// npx playwright install firefox
// npx playwright install webkit

// Install browsers WITH system OS dependencies (required on Linux/CI)
// npx playwright install --with-deps

// Verify installation
// npx playwright --version




// ================================================================================
//  SECTION 8: PROJECT STRUCTURE WALKTHROUGH
// ================================================================================

/*
  DEFAULT STRUCTURE after 'npm init playwright@latest':
  ──────────────────────────────────────────────────────
  playwright-training/
  │
  ├── tests/                         ← Your test files live here
  │   └── example.spec.js            ← Sample test (auto-generated)
  │
  ├── tests-examples/                ← More examples (safe to delete later)
  │   └── demo-todo-app.spec.js
  │
  ├── playwright.config.js           ← MAIN config file (very important)
  │
  ├── package.json                   ← Node.js project config & scripts
  ├── package-lock.json              ← Locked dependency versions
  │
  ├── .github/
  │   └── workflows/
  │       └── playwright.yml         ← GitHub Actions CI config
  │
  └── node_modules/                  ← Installed packages (never edit this)
      └── @playwright/
          └── test/


  ENTERPRISE / SCALABLE STRUCTURE (recommended as project grows):
  ──────────────────────────────────────────────────────────────
  playwright-training/
  │
  ├── tests/                         ← Test files (.spec.js)
  │   ├── auth/
  │   │   └── login.spec.js
  │   ├── products/
  │   │   └── product.spec.js
  │   └── checkout/
  │       └── checkout.spec.js
  │
  ├── pages/                         ← Page Object Model classes
  │   ├── BasePage.js
  │   ├── LoginPage.js
  │   └── ProductPage.js
  │
  ├── fixtures/                      ← Custom Playwright fixtures
  │   └── customFixtures.js
  │
  ├── utils/                         ← Shared helper functions
  │   ├── testData.js
  │   └── helpers.js
  │
  ├── test-data/                     ← Static JSON test data
  │   └── users.json
  │
  ├── playwright.config.js
  └── package.json


  FILE DESCRIPTIONS:
  ------------------
  tests/*.spec.js      → Actual test cases  (spec = specification)
  pages/*.js           → Page Object classes (encapsulate UI interactions)
  fixtures/*.js        → Shared test setup and custom fixtures
  utils/*.js           → Reusable helper / utility functions
  playwright.config.js → Global test configuration (browsers, timeouts, etc.)
  package.json         → Project metadata, dependencies, and npm scripts
*/




// ================================================================================
//  SECTION 9: playwright.config.js — COMPLETE EXPLANATION
// ================================================================================

// ─── FULLY ANNOTATED playwright.config.js (CommonJS) ──────────────────────────

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  // ───────────────────────────────────────────
  // TEST DISCOVERY
  // ───────────────────────────────────────────

  testDir: './tests',
  // Where Playwright looks for test files
  // Can be relative or absolute path

  testMatch: ['**/*.spec.js', '**/*.test.js'],
  // File patterns to match as test files
  // Default: **/*.spec.{js,ts,mjs,cjs,jsx,tsx}

  // ───────────────────────────────────────────
  // EXECUTION SETTINGS
  // ───────────────────────────────────────────

  fullyParallel: true,
  // Run tests within each file in parallel
  // false = tests in same file run sequentially

  workers: process.env.CI ? 1 : undefined,
  // Number of parallel browser workers
  // undefined = Playwright decides (usually half CPU cores)
  // Set to 1 in CI to avoid resource contention

  retries: process.env.CI ? 2 : 0,
  // How many times to retry a failing test
  // 0   = no retries (local development)
  // 2   = retry twice in CI (handles flaky tests)

  timeout: 30000,
  // Maximum time (ms) allowed for each test to run
  // Default: 30000ms (30 seconds)
  // Increase for slow apps or long end-to-end workflows

  expect: {
    timeout: 5000,
    // Maximum time (ms) for expect() assertions to wait
    // Playwright retries assertions automatically until this timeout
  },

  // ───────────────────────────────────────────
  // CI SAFETY
  // ───────────────────────────────────────────

  forbidOnly: !!process.env.CI,
  // true  → test.only() causes the ENTIRE test run to FAIL
  // Prevents accidentally committing test.only() to the CI pipeline

  // ───────────────────────────────────────────
  // OUTPUT FOLDERS
  // ───────────────────────────────────────────

  outputDir: 'test-results/',
  // Folder where screenshots, videos, and traces are saved

  // ───────────────────────────────────────────
  // REPORTING
  // ───────────────────────────────────────────

  reporter: [
    ['list'],                                          // Live console output during test run
    ['html', { open: 'never' }],                       // Interactive HTML report (open manually)
    ['json', { outputFile: 'results.json' }],          // JSON for CI parsing
    // ['junit', { outputFile: 'results.xml' }],       // JUnit XML for Jenkins/Azure DevOps
    // ['allure-playwright'],                           // Allure framework (install separately)
  ],

  // ───────────────────────────────────────────
  // GLOBAL SETUP & TEARDOWN
  // ───────────────────────────────────────────

  globalSetup: './global-setup.js',
  // Runs ONCE before ALL tests begin
  // Typical uses: DB setup, creating test users, seeding data, auth setup

  globalTeardown: './global-teardown.js',
  // Runs ONCE after ALL tests finish
  // Typical uses: DB cleanup, deleting test data, removing test users

  // ───────────────────────────────────────────
  // SHARED SETTINGS FOR ALL TESTS (use block)
  // ───────────────────────────────────────────

  use: {

    baseURL: 'https://www.saucedemo.com',
    // Base URL — page.goto('/login') resolves to baseURL + '/login'
    // Change per environment: dev / staging / production

    browserName: 'chromium',
    // Default browser when no --project flag is specified

    headless: true,
    // true  = no visible browser window (fast — use in CI)
    // false = browser window opens (use when writing/debugging tests)

    viewport: { width: 1280, height: 720 },
    // Default browser window dimensions

    ignoreHTTPSErrors: true,
    // Skip SSL certificate errors (useful for self-signed certs on test envs)

    actionTimeout: 10000,
    // Timeout (ms) for individual actions: click, fill, hover, etc.

    navigationTimeout: 30000,
    // Timeout (ms) for page.goto() and page navigation events

    // ── ARTIFACT CAPTURE ────────────────────

    screenshot: 'only-on-failure',
    // 'on'               → always capture screenshot after each test
    // 'off'              → never capture
    // 'only-on-failure'  → capture only when test FAILS (recommended)

    video: 'retain-on-failure',
    // 'on'               → always record video
    // 'off'              → never record
    // 'on-first-retry'   → record only on first retry attempt
    // 'retain-on-failure'→ record always, delete if test PASSES (recommended)

    trace: 'on-first-retry',
    // 'on'               → always capture trace (detailed — large files)
    // 'off'              → never capture
    // 'on-first-retry'   → capture trace on first retry (recommended for CI)
    // 'retain-on-failure'→ keep trace only when test fails

    // ── LOCALE / TIMEZONE ───────────────────

    locale: 'en-US',
    timezoneId: 'America/New_York',
    colorScheme: 'light',           // 'dark' | 'no-preference'

    // ── HTTP BASIC AUTH ──────────────────────

    httpCredentials: {
      username: 'user',
      password: 'pass',
      // Used for HTTP Basic Authentication on protected test environments
    },

    // ── EXTRA HTTP HEADERS ───────────────────

    extraHTTPHeaders: {
      'x-custom-header': 'value',
      // Attach custom headers to every request made during tests
    },

    // ── LAUNCH OPTIONS (slowMo for demos) ────

    launchOptions: {
      slowMo: 0,
      // slowMo: 500 → adds 500ms delay between each action (great for demos)
    },
  },

  // ───────────────────────────────────────────
  // PROJECTS — Multi-Browser / Multi-Device
  // ───────────────────────────────────────────

  projects: [

    // ── DESKTOP BROWSERS ──────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // ── MOBILE EMULATION ──────────────────────
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // ── BRANDED / SYSTEM BROWSERS ─────────────
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      // Uses your system's installed Google Chrome
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      // Uses your system's installed Microsoft Edge
    },
  ],

});


// ─── MINIMAL CONFIG FOR BEGINNERS ─────────────────────────────────────────────

/*
  // playwright.config.js
  const { defineConfig } = require('@playwright/test');

  module.exports = defineConfig({
    testDir: './tests',
    use: {
      baseURL: 'https://www.saucedemo.com',
      headless: true,
      screenshot: 'only-on-failure',
    },
  });
*/




// ================================================================================
//  SECTION 10: RUNNING YOUR FIRST TEST
// ================================================================================

// ─── THE DEFAULT GENERATED TEST (example.spec.js) ─────────────────────────────

const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
});

/*
  LINE-BY-LINE EXPLANATION:
  --------------------------

  const { test, expect }           → Import the test function and assertion library
  = require('@playwright/test')      from the Playwright test runner package

  test('has title', async          → Define a test case named 'has title'
    ({ page }) => {                  page = Playwright fixture (automatically provided)
                                     async = required because browser calls are async

    await page.goto(...)           → Navigate browser to the URL
                                     await = pause execution until navigation completes

    await expect(page)             → Start an assertion on the page object
      .toHaveTitle(/Playwright/)   → Assert: page title must match regex /Playwright/
                                     Playwright retries this until it passes or times out
  });
*/

// ─── HOW TO RUN TESTS (Terminal Commands) ─────────────────────────────────────

// Run ALL tests (headless by default)
// npx playwright test

// Run in HEADED mode (see the browser)
// npx playwright test --headed

// Run a SPECIFIC FILE
// npx playwright test tests/example.spec.js

// Run tests matching a NAME pattern
// npx playwright test --grep "has title"

// Run on a SPECIFIC BROWSER
// npx playwright test --project=chromium
// npx playwright test --project=firefox
// npx playwright test --project=webkit

// Run with HTML reporter and view it
// npx playwright test --reporter=html
// npx playwright show-report

// Run in DEBUG mode (opens Playwright Inspector)
// npx playwright test --debug

// Run a specific file in debug mode
// npx playwright test tests/example.spec.js --debug

// Run with verbose list output
// npx playwright test --reporter=list


// ─── ADD NPM SCRIPTS TO package.json ──────────────────────────────────────────

const packageJsonScripts = {
  scripts: {
    "test":                 "playwright test",
    "test:headed":          "playwright test --headed",
    "test:debug":           "playwright test --debug",
    "test:report":          "playwright show-report",
    "test:chrome":          "playwright test --project=chromium",
    "test:firefox":         "playwright test --project=firefox",
    "test:webkit":          "playwright test --project=webkit",
    "test:ui":              "playwright test --ui",
    "test:update-snapshots": "playwright test --update-snapshots",
  }
};
// Then run:  npm test   OR   npm run test:headed




// ================================================================================
//  SECTION 11: PLAYWRIGHT CLI COMMANDS OVERVIEW
// ================================================================================

/*
  COMMAND                                  | PURPOSE
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright test                      | Run all tests
  npx playwright test FILE                 | Run specific test file
  npx playwright test --headed             | Run with browser window visible
  npx playwright test --debug              | Launch Playwright Inspector (step-debug)
  npx playwright test --grep "TEXT"        | Filter and run tests matching name
  npx playwright test --project NAME       | Run on specific browser/project
  npx playwright test --workers N          | Set number of parallel worker threads
  npx playwright test --retries N          | Set number of retries on failure
  npx playwright test --timeout MS         | Set per-test timeout in milliseconds
  npx playwright test --reporter TYPE      | Set reporter: html/json/junit/list/dot
  npx playwright test --shard M/N          | Run shard M out of N total shards
  npx playwright test --update-snapshots   | Regenerate visual/snapshot baselines
  npx playwright test --ui                 | Open interactive UI Mode
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright show-report               | Open the last HTML report in browser
  npx playwright show-report FOLDER        | Open HTML report from specific folder
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright codegen URL               | Open Codegen — record actions as code
  npx playwright codegen URL               |
    --save-storage auth.json               | Codegen + save auth state
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright install                   | Install all supported browsers
  npx playwright install chromium          | Install only Chromium
  npx playwright install --with-deps       | Install browsers + OS system dependencies
  npx playwright install --dry-run         | Preview what would be installed
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright show-trace TRACE_FILE     | Open Trace Viewer for a trace.zip file
  ─────────────────────────────────────────|────────────────────────────────────────
  npx playwright screenshot URL FILE       | Take a screenshot of any URL
  npx playwright pdf URL FILE              | Generate PDF of any URL
  npx playwright --version                 | Print current Playwright version
*/

/*
  PLAYWRIGHT UI MODE — Highly Recommended for Beginners:
  -------------------------------------------------------
  Command: npx playwright test --ui

  Opens a graphical desktop app where you can:
  ✔ Browse all test files and individual tests in a tree
  ✔ Click any test to run it individually
  ✔ Watch the browser live while the test runs
  ✔ See each test step in real-time with timing
  ✔ Instantly view trace for any test step
  ✔ Filter tests by tags, file name, or pass/fail status
  ✔ Re-run failed tests with one click
*/




// ================================================================================
//  SECTION 12: PLAYWRIGHT TEST RUNNER vs STANDALONE LIBRARY
// ================================================================================

/*
  PLAYWRIGHT HAS TWO DISTINCT MODES OF USE:

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. @playwright/test  — FULL TEST RUNNER  (recommended for testing)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  What it is: A complete testing framework built on top of Playwright.

  Includes:
  ✔ test() / describe() / beforeEach() / afterAll() etc.
  ✔ Fixtures system  (page, context, browser auto-provided)
  ✔ Web-first assertions with auto-waiting
  ✔ Parallel execution with workers
  ✔ Built-in reporters: HTML, JSON, JUnit, List
  ✔ playwright.config.js for global configuration
  ✔ Automatic screenshot, video, trace capture on failure
*/

// ── SYNTAX using @playwright/test ──────────────────────────────────────────
const { test: playwrightTest, expect: playwrightExpect } = require('@playwright/test');

playwrightTest('my test using test runner', async ({ page }) => {
  // 'page' is automatically created and injected by the fixture system
  // No manual browser.launch() or context.newPage() needed
  await page.goto('https://example.com');
  await playwrightExpect(page).toHaveTitle('Example Domain');
});
// Run with: npx playwright test


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  2. playwright  (standalone)  — AUTOMATION LIBRARY ONLY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  What it is: Just the browser automation library — no test runner included.

  Use cases:
  ✔ Web scraping scripts
  ✔ Browser automation tasks (not tests)
  ✔ Integrating into Jest, Vitest, or other test frameworks
  ✔ Custom one-off automation scripts
*/

// ── SYNTAX using standalone playwright ─────────────────────────────────────
const { chromium } = require('playwright');   // NOTE: 'playwright', NOT '@playwright/test'

async function runStandaloneScript() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page    = await context.newPage();

  await page.goto('https://example.com');
  console.log('Page title:', await page.title());

  await browser.close(); // Always close manually — no test runner teardown
}

runStandaloneScript();
// Run with: node script.js


/*
  FEATURE COMPARISON:
  ───────────────────────────────────────────────────────────────────────────
  Feature                 | @playwright/test     | playwright (standalone)
  ─────────────────────── |──────────────────────|─────────────────────────
  Test runner included    | YES                  | NO
  Fixtures (page,context) | YES (auto-injected)  | NO (manual setup needed)
  Auto-waiting assertions | YES                  | NO
  Parallel execution      | YES (built-in)       | Manual implementation
  HTML / JSON Report      | YES                  | NO
  Screenshot on failure   | YES (auto)           | NO
  Use case                | Writing tests        | Scripting / Scraping
  ──────────────────────────────────────────────────────────────────────────

  ► FOR THIS TRAINING: We use @playwright/test exclusively.
*/




// ================================================================================
//  SECTION 13: HEADLESS vs HEADED MODE
// ================================================================================

/*
  HEADLESS MODE  (headless: true)
  ────────────────────────────────
  Definition : Browser runs WITHOUT a visible window — no GUI shown at all.
  Default    : true in most Playwright setups

  Advantages:
  ✔ Much FASTER — no rendering overhead
  ✔ Lower RAM and CPU usage
  ✔ Works in CI/CD environments (no display/monitor needed)
  ✔ Can run many browsers in parallel easily

  Disadvantages:
  ✗ Cannot see what is happening visually
  ✗ Harder to debug failing tests
  ✗ Occasional rendering differences from real browser

  Best for: CI pipelines, regression test suites, nightly automated runs


  HEADED MODE  (headless: false)
  ────────────────────────────────
  Definition : Browser opens with a VISIBLE window you can watch in real-time.
  Enable via : headless: false  OR  --headed flag

  Advantages:
  ✔ See every action the test performs in real time
  ✔ Excellent for writing and developing new tests
  ✔ Great for debugging failures visually
  ✔ Perfect for demos and training sessions

  Disadvantages:
  ✗ Slower due to rendering overhead
  ✗ Requires a display (problematic in CI without virtual display)
  ✗ Can't run too many in parallel (each needs screen space)

  Best for: Local development, writing tests, debugging, demos, training
*/

// ─── SLOMO MODE — add delay between each action ────────────────────────────

// In playwright.config.js  →  use block:
const useSloMoConfig = {
  launchOptions: {
    slowMo: 500,  // 500ms pause between every single action
    // Great for demos, training, and slow step-by-step visual verification
  },
};

// Or when launching browser manually:
async function launchWithSlowMo() {
  const { chromium: chromiumBrowser } = require('playwright');
  const browser = await chromiumBrowser.launch({
    headless: false,
    slowMo: 1000,   // 1 second delay between actions
  });
  return browser;
}

/*
  SWITCHING MODES FROM TERMINAL:
  ─────────────────────────────────────────────────────────
  npx playwright test --headed          → headed (see browser)
  npx playwright test --headless        → force headless
  PWDEBUG=1 npx playwright test         → debug mode (headed + Inspector)
*/




// ================================================================================
//  SECTION 14: REAL-TIME SCENARIO
// ================================================================================

/*
  SCENARIO: Set up a Playwright project for an e-commerce application
  ─────────────────────────────────────────────────────────────────────
  Context: You join a company as a QA Engineer on Day 1.
           The app is an e-commerce site: https://www.saucedemo.com
           Task: Set up a complete Playwright framework from scratch.

  STEP 1 — Create the project (terminal commands):
  ─────────────────────────────────────────────────
  mkdir ecommerce-automation
  cd ecommerce-automation
  npm init playwright@latest
  → Choose: JavaScript, tests folder, yes GitHub Actions, yes install browsers
*/

// STEP 2 — playwright.config.js for the e-commerce project:
const { defineConfig: defineEcomConfig, devices: ecomDevices } = require('@playwright/test');

const ecommerceConfig = defineEcomConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...ecomDevices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...ecomDevices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...ecomDevices['Desktop Safari'] } },
  ],
});


// STEP 3 — tests/login.spec.js — First real test for SauceDemo:
const { test: sauceTest, expect: sauceExpect } = require('@playwright/test');

sauceTest.describe('Sauce Demo - Login Module', () => {

  sauceTest('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to app (baseURL is already set in config)
    await page.goto('/');

    // Assert login page loaded correctly
    await sauceExpect(page).toHaveTitle('Swag Labs');

    // Fill in valid credentials
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');

    // Submit the login form
    await page.locator('#login-button').click();

    // Verify successful login — should redirect to inventory page
    await sauceExpect(page).toHaveURL('/inventory.html');
    await sauceExpect(page.locator('.title')).toHaveText('Products');
  });

  sauceTest('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/');

    // Enter wrong username and password
    await page.locator('#user-name').fill('wrong_user');
    await page.locator('#password').fill('wrong_pass');
    await page.locator('#login-button').click();

    // Verify error message is displayed
    await sauceExpect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match');
  });

});

/*
  STEP 4 — Run the tests (terminal):
  ────────────────────────────────────
  npx playwright test                   ← Run all tests (headless)
  npx playwright test --headed          ← Watch browser while tests run
  npx playwright show-report            ← Open HTML report in browser

  STEP 5 — Expected Results:
  ────────────────────────────────────
  Running 6 tests using 3 workers (3 browsers × 2 tests)

    ✓ [chromium] › login.spec.js:5  › should login successfully  (1.2s)
    ✓ [firefox]  › login.spec.js:5  › should login successfully  (1.8s)
    ✓ [webkit]   › login.spec.js:5  › should login successfully  (1.5s)
    ✓ [chromium] › login.spec.js:20 › should show error          (0.9s)
    ✓ [firefox]  › login.spec.js:20 › should show error          (1.1s)
    ✓ [webkit]   › login.spec.js:20 › should show error          (1.0s)

  6 passed (5.2s)
*/




// ================================================================================
//  SECTION 15: INTERVIEW QUESTIONS WITH DETAILED ANSWERS
// ================================================================================

/*
  ════════════════════════════════════════════════════════════════════
  QUESTION 1:
  Q: What is Playwright and how is it different from Selenium?
  ════════════════════════════════════════════════════════════════════

  A: Playwright is an open-source browser automation and end-to-end testing
     framework built by Microsoft. Key differences from Selenium:

     1. PROTOCOL:
        Playwright uses CDP (Chrome DevTools Protocol) over WebSocket.
        Selenium uses the HTTP-based W3C WebDriver protocol.
        WebSocket is faster (bidirectional) vs HTTP (request-response).

     2. AUTO-WAITING:
        Playwright has BUILT-IN auto-waiting — it automatically waits for
        elements to be visible, stable, and enabled before interacting.
        Selenium requires manual explicit waits (WebDriverWait + ExpectedConditions).

     3. BROWSER DRIVERS:
        Playwright bundles its own browser versions — no external drivers needed.
        Selenium needs chromedriver, geckodriver, msedgedriver installed separately.

     4. RELIABILITY:
        Auto-waiting + actionability checks eliminate most flaky tests.
        Selenium tests are notoriously flaky without careful wait management.

     5. BUILT-IN FEATURES:
        Playwright: network interception, API testing, visual testing, tracing
        are all included out of the box.
        Selenium needs additional libraries: BrowserMob for network, Applitools
        for visual testing, etc.

     6. MULTI-BROWSER API:
        Playwright provides a SINGLE identical API for Chrome, Firefox, and Safari.
        Selenium API is consistent but browser behaviour can differ significantly.
*/

/*
  ════════════════════════════════════════════════════════════════════
  QUESTION 2:
  Q: Explain the Playwright architecture. How does it communicate
     with browsers internally?
  ════════════════════════════════════════════════════════════════════

  A: Playwright has a 3-layer architecture:

     LAYER 1 — Test Code:
       Your JavaScript test files that call the Playwright API.

     LAYER 2 — Playwright Node.js Library:
       Translates API calls into low-level browser commands.
       Manages browser processes, contexts, and pages.

     LAYER 3 — Browser Engines (separate OS processes):
       Communicate via browser-specific protocols over WebSocket:
         → Chromium/Edge : Chrome DevTools Protocol (CDP)
         → Firefox       : Firefox Remote Protocol
         → WebKit        : WebKit Inspector Protocol

     KEY PRINCIPLE — Out of Process Architecture:
       The browser runs as a SEPARATE OS process from your test process.
       ✔ Browser crash ≠ test crash (and vice versa)
       ✔ Multiple browsers can run truly simultaneously
       ✔ True test isolation via BrowserContext (like incognito profiles)
*/

/*
  ════════════════════════════════════════════════════════════════════
  QUESTION 3:
  Q: What is the difference between headless and headed mode?
     When would you use each?
  ════════════════════════════════════════════════════════════════════

  A:
     HEADED MODE (headless: false):
       ✔ Browser opens with a visible window — you can see every action
       ✔ Best for writing new tests, debugging failures, demos, training
       ✗ Slower, requires a monitor/display, bad for CI

     HEADLESS MODE (headless: true):
       ✔ Browser runs invisibly — faster, less memory, works in CI
       ✔ Best for regression suites, nightly runs, CI/CD pipelines
       ✗ Cannot visually see what is happening

     RECOMMENDATION:
       Develop and debug locally in HEADED mode.
       Run tests in CI using HEADLESS mode.
       Use Playwright's Trace Viewer afterward to see exactly what
       happened in headless runs — without re-running the test.
*/

/*
  ════════════════════════════════════════════════════════════════════
  QUESTION 4:
  Q: What browsers does Playwright support? How does it download them?
  ════════════════════════════════════════════════════════════════════

  A: Playwright supports 3 browser engines:
       1. Chromium → powers Google Chrome and Microsoft Edge
       2. Firefox  → Mozilla Firefox
       3. WebKit   → the engine behind Apple Safari

     Playwright bundles its OWN specific browser versions.
     Running 'npx playwright install' downloads these to:
       Windows: %USERPROFILE%\AppData\Local\ms-playwright\
       Mac/Linux: ~/.cache/ms-playwright/

     WHY BUNDLED VERSIONS?
       ✔ Identical behaviour across every developer machine and every CI server
       ✔ No risk of your tests breaking because someone updated their browser
       ✔ 100% reproducible builds — same test = same result everywhere

     To use system-installed browsers instead:
       channel: 'chrome'   → uses your installed Google Chrome
       channel: 'msedge'   → uses your installed Microsoft Edge
*/

/*
  ════════════════════════════════════════════════════════════════════
  QUESTION 5:
  Q: What is playwright.config.js? Explain key configuration options
     you would use in a real production project.
  ════════════════════════════════════════════════════════════════════

  A: playwright.config.js is the CENTRAL configuration file that controls
     every aspect of how tests are discovered, executed, and reported.

     Key options I use in real projects:

     1. testDir         → Tells Playwright where test files are located

     2. use.baseURL     → Sets the application URL so tests use relative
                          paths: page.goto('/login') instead of full URL.
                          Switch easily between dev / staging / production.

     3. retries         → Set to 2 in CI to handle infrastructure flakiness.
                          Set to 0 locally to catch real bugs quickly.

     4. fullyParallel   → true: maximises test execution speed by running
                          tests within a file in parallel.

     5. workers         → Tune parallelism: half CPU cores locally,
                          1-2 workers in CI to avoid resource limits.

     6. screenshot/video/trace → 'only-on-failure' / 'retain-on-failure':
                          Captures artifacts only for failed tests — helps
                          debugging without filling up disk space.

     7. projects        → Defines Chrome, Firefox, Safari, and mobile device
                          configurations so the same test suite runs on all.

     8. forbidOnly      → Prevents test.only() from being committed to CI
                          accidentally and blocking the entire pipeline.

     9. reporter        → Multiple reporters simultaneously:
                          HTML for human review, JUnit for Jenkins/Azure DevOps,
                          JSON for custom dashboards and Slack notifications.
*/




// ================================================================================
//  SECTION 16: MCQ QUIZ (10 QUESTIONS WITH ANSWERS)
// ================================================================================

/*
  ─────────────────────────────────────────────────────────────────────────────
  Q1. Who developed and maintains Playwright?
  ─────────────────────────────────────────────────────────────────────────────
      a) Google
      b) Mozilla
      c) Microsoft   ✓ CORRECT
      d) Facebook

  ─────────────────────────────────────────────────────────────────────────────
  Q2. Which protocol does Playwright use to communicate with Chromium?
  ─────────────────────────────────────────────────────────────────────────────
      a) WebDriver Protocol
      b) HTTP REST API
      c) Chrome DevTools Protocol (CDP)   ✓ CORRECT
      d) Selenium Grid Protocol

  ─────────────────────────────────────────────────────────────────────────────
  Q3. When was Playwright v1 first released?
  ─────────────────────────────────────────────────────────────────────────────
      a) 2016
      b) 2018
      c) 2020   ✓ CORRECT
      d) 2022

  ─────────────────────────────────────────────────────────────────────────────
  Q4. Which browser is NOT natively supported by Playwright?
  ─────────────────────────────────────────────────────────────────────────────
      a) Chromium
      b) Firefox
      c) Internet Explorer   ✓ CORRECT  (IE is discontinued and unsupported)
      d) WebKit

  ─────────────────────────────────────────────────────────────────────────────
  Q5. What command initializes a brand new Playwright project?
  ─────────────────────────────────────────────────────────────────────────────
      a) npx playwright new
      b) npm init playwright@latest   ✓ CORRECT
      c) npx playwright init
      d) npm install playwright

  ─────────────────────────────────────────────────────────────────────────────
  Q6. What does 'fullyParallel: true' do in playwright.config.js?
  ─────────────────────────────────────────────────────────────────────────────
      a) Runs all tests across multiple machines simultaneously
      b) Runs all tests in a file one after another (sequentially)
      c) Runs tests within each file in parallel   ✓ CORRECT
      d) Runs only tests tagged @smoke in parallel

  ─────────────────────────────────────────────────────────────────────────────
  Q7. Which mode runs the browser WITHOUT a visible window?
  ─────────────────────────────────────────────────────────────────────────────
      a) Headed mode
      b) Headless mode   ✓ CORRECT
      c) Debug mode
      d) SlowMo mode

  ─────────────────────────────────────────────────────────────────────────────
  Q8. What does 'forbidOnly: !!process.env.CI' do in the configuration?
  ─────────────────────────────────────────────────────────────────────────────
      a) Forbids running any tests in CI environment
      b) Fails the entire test run if test.only() is present in CI   ✓ CORRECT
      c) Runs only tests marked with .only in CI
      d) Prevents parallel execution in CI

  ─────────────────────────────────────────────────────────────────────────────
  Q9. Which command opens the Playwright Trace Viewer?
  ─────────────────────────────────────────────────────────────────────────────
      a) npx playwright debug
      b) npx playwright open-trace
      c) npx playwright show-trace   ✓ CORRECT
      d) npx playwright trace-view

  ─────────────────────────────────────────────────────────────────────────────
  Q10. What is the key difference between @playwright/test and playwright?
  ─────────────────────────────────────────────────────────────────────────────
      a) @playwright/test supports more browsers than playwright standalone
      b) playwright standalone is significantly faster
      c) @playwright/test includes a full test runner with fixtures,
         parallel execution, and built-in reporters   ✓ CORRECT
      d) There is no meaningful difference between the two packages

  ─────────────────────────────────────────────────────────────────────────────
  ANSWER KEY:  1-C  |  2-C  |  3-C  |  4-C  |  5-B  |  6-C  |  7-B  |  8-B  |  9-C  |  10-C
  ─────────────────────────────────────────────────────────────────────────────

  SCORE GUIDE:
  ✦ 9-10 correct → Excellent! You fully understand Day 1. Ready for Day 2.
  ✦ 7-8  correct → Good. Review the sections covering the wrong answers.
  ✦ 5-6  correct → Re-read Sections 3 (Architecture) and 9 (Config).
  ✦ < 5  correct → Re-read the complete Day 1 material before proceeding.
*/




// ================================================================================
//  SECTION 17: HANDS-ON ASSIGNMENT
// ================================================================================

/*
  ══════════════════════════════════════════════════════════════════════════════
  COMPLETE ALL TASKS BEFORE MOVING TO DAY 2
  ══════════════════════════════════════════════════════════════════════════════

  TASK 1: Environment Setup  (30 min)
  ─────────────────────────────────────────────────────────────────────────────
  1. Install Node.js LTS (v20 or v22) from https://nodejs.org
  2. Install VS Code from https://code.visualstudio.com
  3. Install "Playwright Test for VSCode" extension (Ctrl+Shift+X)
  4. Create folder: C:\Animesh\Training\PLAYWRIGHT\day01-practice
  5. Inside that folder, run: npm init playwright@latest
  6. Verify: npx playwright --version  (should print the version)


  TASK 2: Explore the Default Tests  (20 min)
  ─────────────────────────────────────────────────────────────────────────────
  1. Open example.spec.js in VS Code
  2. Run: npx playwright test --headed
  3. Watch the browser open and navigate to playwright.dev
  4. Run: npx playwright show-report
  5. Explore the HTML report — click a test to see screenshots, steps, trace


  TASK 3: Modify playwright.config.js  (20 min)
  ─────────────────────────────────────────────────────────────────────────────
  Update these settings in playwright.config.js:
  1. baseURL       → 'https://www.saucedemo.com'
  2. screenshot    → 'only-on-failure'
  3. video         → 'retain-on-failure'
  4. trace         → 'on-first-retry'
  5. Save the file and verify no errors appear


  TASK 4: Write Your First 3 Tests  (40 min)
  ─────────────────────────────────────────────────────────────────────────────
  Create file: tests/my-first-test.spec.js
  Write these tests:
    Test 1: Verify saucedemo.com login page has title "Swag Labs"
    Test 2: Verify the #login-button element exists and is visible
    Test 3: Verify that filling wrong credentials shows an error element

  Run them:
    npx playwright test tests/my-first-test.spec.js --headed
    npx playwright test tests/my-first-test.spec.js --project=chromium
    npx playwright test tests/my-first-test.spec.js --project=firefox


  TASK 5: Explore CLI Commands  (20 min)
  ─────────────────────────────────────────────────────────────────────────────
  Run each command and note what it does:
    npx playwright test --list                           (list all tests without running)
    npx playwright test --ui                             (open interactive UI mode)
    npx playwright codegen https://www.saucedemo.com     (open Codegen recorder)

  In Codegen:
    1. Click on the username input
    2. Type a username
    3. Observe the generated JavaScript code on the right panel
    4. Copy the generated code and paste it into a new spec file


  TASK 6: Challenge (Optional / Advanced)
  ─────────────────────────────────────────────────────────────────────────────
  ✦ Run your tests across ALL 3 browsers: chromium, firefox, webkit
    and compare the execution times

  ✦ Intentionally BREAK a test (wrong expected value) and observe:
    - What the error message looks like in terminal
    - The screenshot captured in the HTML report
    - How to read the trace viewer

  ✦ Add slowMo: 1000 to launchOptions and watch tests run in slow motion


  SUBMISSION CHECKLIST:
  ─────────────────────────────────────────────────────────────────────────────
  □ Node.js and VS Code installed and verified
  □ Playwright project initialized successfully
  □ Default example tests run and passed
  □ playwright.config.js updated with saucedemo baseURL
  □ 3 custom tests written and passing
  □ HTML report opened and explored
  □ CLI commands practiced (list, ui, codegen)
  □ Codegen tool used to record at least one action
*/




// ================================================================================
//  QUICK REFERENCE CARD — DAY 1
// ================================================================================

const CLI_QUICK_REFERENCE = {
  "Install Playwright":   "npm init playwright@latest",
  "Run all tests":        "npx playwright test",
  "Run headed":           "npx playwright test --headed",
  "Run one file":         "npx playwright test tests/file.spec.js",
  "Run one test":         "npx playwright test --grep \"test name\"",
  "Specific browser":     "npx playwright test --project=chromium",
  "Open report":          "npx playwright show-report",
  "Debug mode":           "npx playwright test --debug",
  "UI Mode":              "npx playwright test --ui",
  "Record tests":         "npx playwright codegen URL",
  "Install browsers":     "npx playwright install",
  "Check version":        "npx playwright --version",
};




// ================================================================================
//  SUMMARY OF KEY CONCEPTS — DAY 1
// ================================================================================

/*
  ✔  Playwright      = Microsoft's open-source browser automation framework (2020)
  ✔  Protocol        = CDP over WebSocket (NOT HTTP like Selenium) → FASTER
  ✔  Auto-waiting    = Built-in → NO FLAKY TESTS → no manual waits needed
  ✔  Browsers        = Chromium, Firefox, WebKit — all in ONE tool, ONE API
  ✔  No drivers      = Playwright bundles its own browser versions
  ✔  @playwright/test= Full test runner → what we use for ALL testing
  ✔  playwright      = Standalone library → for scripting/scraping only
  ✔  headless: true  = No browser window → fast → use in CI
  ✔  headless: false = Browser visible → use when writing/debugging
  ✔  playwright.config.js = Central control for ALL test settings
  ✔  npx playwright test  = Run all tests
  ✔  npx playwright --ui  = Interactive runner → great for beginners
  ✔  npx playwright show-report = Open interactive HTML test report
*/




// ================================================================================
//  NEXT UP: DAY 2 — Browser, BrowserContext & Page (Core Concepts)
// ================================================================================
//  Topics: Browser hierarchy, launch options, contexts, pages,
//          navigation, lifecycle events, device emulation
// ================================================================================
