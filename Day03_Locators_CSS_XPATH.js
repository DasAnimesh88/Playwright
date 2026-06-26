// ================================================================================
//          DAY 2 - PLAYWRIGHT CORE CONCEPTS: BROWSER, CONTEXT & PAGE
//          Playwright Complete Training | Phase 1: Foundation
// ================================================================================
// Duration   : 3-4 Hours
// Difficulty : Beginner → Intermediate
// Prerequisites: Day 1 completed | Node.js installed | Basic JavaScript
// ================================================================================

// ────────────────────────────────────────────────────────────────────────────────
//  TABLE OF CONTENTS
// ────────────────────────────────────────────────────────────────────────────────
//  1.  JavaScript Concepts Used in Playwright (async/await/Promise)
//  2.  Browser, BrowserContext, and Page — The Hierarchy
//  3.  Launching a Browser (chromium, firefox, webkit)
//  4.  Browser Launch Options (headless, slowMo, args, devtools)
//  5.  Creating a BrowserContext (browser.newContext())
//  6.  Context Options (viewport, locale, timezone, permissions, geolocation)
//  7.  Creating a Page (context.newPage())
//  8.  Navigating Pages (goto, reload, goBack, goForward)
//  9.  Page Lifecycle Events (domcontentloaded, load, networkidle)
//  10. Closing Resources (page.close, context.close, browser.close)
//  11. Multiple Contexts and Pages (Tabs)
//  12. Incognito / Isolated Contexts
//  13. Device Emulation using devices dictionary
//  14. Real-Time Scenario: Travel Booking Site with Device Viewports
//  15. Interview Questions with Detailed Answers (5)
//  16. MCQ Quiz (10 Questions with Answer Key)
//  17. One-Word / Short-Answer Questions (How Interviewers Ask Them)
//  18. Hands-on Assignment
// ────────────────────────────────────────────────────────────────────────────────




// ================================================================================
//  SECTION 1: JAVASCRIPT CONCEPTS USED IN PLAYWRIGHT
//  (You MUST understand these before Playwright makes sense)
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1A: What is Synchronous vs Asynchronous Code?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SYNCHRONOUS (Blocking):
    Code runs line by line. Line 2 WAITS for Line 1 to finish.

    Example:
      console.log("Step 1");
      console.log("Step 2");   // Always runs AFTER Step 1
      console.log("Step 3");
    Output: Step 1 → Step 2 → Step 3  (guaranteed order)

  ASYNCHRONOUS (Non-Blocking):
    Code does NOT wait. It fires a task and moves on.
    When the task finishes, it notifies (via callback, promise, or async/await).

    Real-world analogy:
    You order food at a restaurant (async).
    You don't stand at the counter waiting — you sit, chat, do other things.
    When food is ready, the waiter NOTIFIES you.

    Why is browser automation ASYNC?
    Because browser operations take time:
      - page.goto()      → network request, DNS lookup, HTML download
      - page.click()     → browser finds element, moves mouse, fires click event
      - page.fill()      → types characters into input field
    These all take UNPREDICTABLE time → must be async.
*/


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1B: What is a PROMISE?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  A Promise is a JavaScript OBJECT that represents the EVENTUAL RESULT
  of an asynchronous operation.

  States of a Promise:
  ┌──────────────┬────────────────────────────────────────────────┐
  │    State     │                  Meaning                       │
  ├──────────────┼────────────────────────────────────────────────┤
  │  pending     │ Operation is still running (not done yet)      │
  │  fulfilled   │ Operation completed SUCCESSFULLY (has a value) │
  │  rejected    │ Operation FAILED (has an error/reason)         │
  └──────────────┴────────────────────────────────────────────────┘

  Real-world analogy:
  You order a package online.
  The ORDER CONFIRMATION is the Promise.
    - While shipping  → pending
    - Package arrived → fulfilled (resolved with your package)
    - Lost in transit → rejected (reason: lost)

  Promise structure:
*/

// Promise example — the OLD way (before async/await)
function goToGoogleOldWay(page) {
  return page.goto('https://www.google.com')   // Returns a Promise
    .then(function(response) {
      console.log('Page loaded, status:', response.status());
      return page.title();                      // Returns another Promise
    })
    .then(function(title) {
      console.log('Page title:', title);
    })
    .catch(function(error) {
      console.error('Navigation failed:', error);
    });
}
// ↑ This is HARD to read. "Callback hell" or "Promise chaining" problem.
// Nested .then() chains get messy. That's why async/await was invented.


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1C: async / await — The MODERN way to handle Promises
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  'async' keyword:
    → Placed BEFORE a function definition.
    → Makes the function ALWAYS return a Promise.
    → Enables the use of 'await' INSIDE that function.

  'await' keyword:
    → Can ONLY be used INSIDE an 'async' function.
    → PAUSES execution of that async function until the Promise resolves.
    → Extracts the RESOLVED VALUE from the Promise.
    → Does NOT block the entire Node.js event loop — other work can continue.

  RULE: Every time you call a Playwright method that returns a Promise,
        you MUST put 'await' before it.
        If you forget 'await', the test won't work correctly!
*/

// Same example using async/await — MUCH cleaner!
async function goToGoogleNewWay(page) {
  const response = await page.goto('https://www.google.com');
  // ↑ Pauses here until navigation completes, THEN assigns response
  console.log('Page loaded, status:', response.status());

  const title = await page.title();
  // ↑ Pauses here until title is retrieved
  console.log('Page title:', title);
}

/*
  HOW PLAYWRIGHT USES async/await:
  Every Playwright test callback is async:

    test('my test', async ({ page }) => {  ← async function
      await page.goto('...');              ← await each action
      await page.locator('...').click();   ← await each action
      await expect(page).toHaveTitle('..');← await each assertion
    });

  WHAT HAPPENS IF YOU FORGET 'await'?

    test('bad test', async ({ page }) => {
      page.goto('https://google.com');    // ← NO await!
      // page.goto() returns a Promise but we don't wait for it.
      // Next line runs IMMEDIATELY, before the page has loaded.
      // The test will fail or behave unexpectedly!
      page.locator('input').fill('test'); // ← Runs before page loads!
    });
*/


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1D: Destructuring — Used in Playwright test({ page }) syntax
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  In Playwright tests, you see: async ({ page }) => { ... }
  The { page } is OBJECT DESTRUCTURING.

  Without destructuring:
    async (fixtures) => {
      const page = fixtures.page;
      const context = fixtures.context;
    }

  With destructuring (cleaner):
    async ({ page, context, browser }) => {
      // page, context, browser are directly available
    }

  Playwright passes a FIXTURES OBJECT to every test.
  You destructure what you need: page, context, browser, request, etc.
*/


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1E: Arrow Functions — Used everywhere in Playwright
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Regular function:
    test('login', async function({ page }) { ... });

  Arrow function (modern, cleaner):
    test('login', async ({ page }) => { ... });

  Arrow functions do NOT have their own 'this' — important in class-based POM.
*/


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1F: try/catch/finally — Error handling in async Playwright code
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  When an awaited Promise rejects (fails), it throws an error.
  Use try/catch to handle it gracefully.
*/

// Example: closing browser even if test fails
async function exampleWithErrorHandling() {
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://example.com');
    // ... test steps
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close(); // ← Runs ALWAYS, whether test passed or failed
  }
}


/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOPIC 1G: Promise.all() — Running async operations in PARALLEL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Promise.all() takes an ARRAY of Promises and waits for ALL to resolve.
  Used in Playwright for parallel operations — opens multiple tabs at once.

  Sequential (slow):
    await page1.goto('https://siteA.com');   // Wait for A
    await page2.goto('https://siteB.com');   // Wait for B  (total: A + B time)

  Parallel (fast) using Promise.all:
    await Promise.all([
      page1.goto('https://siteA.com'),       // Both start at same time
      page2.goto('https://siteB.com'),       // Total time: max(A, B) time
    ]);
*/




// ================================================================================
//  SECTION 2: BROWSER, BROWSERCONTEXT, AND PAGE — THE HIERARCHY
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  THE THREE-LAYER MODEL (think of it like a Russian nesting doll)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────────────────────────┐
  │                        BROWSER                                      │
  │   (The whole browser application — Chromium / Firefox / WebKit)     │
  │                                                                     │
  │   ┌─────────────────────────┐   ┌─────────────────────────┐        │
  │   │   BrowserContext 1      │   │   BrowserContext 2       │        │
  │   │   (User A — logged in)  │   │   (User B — incognito)  │        │
  │   │                         │   │                          │        │
  │   │  ┌────────┐ ┌────────┐  │   │  ┌────────┐             │        │
  │   │  │ Page 1 │ │ Page 2 │  │   │  │ Page 1 │             │        │
  │   │  │ Tab 1  │ │ Tab 2  │  │   │  │ Tab 1  │             │        │
  │   │  └────────┘ └────────┘  │   │  └────────┘             │        │
  │   └─────────────────────────┘   └─────────────────────────┘        │
  └─────────────────────────────────────────────────────────────────────┘

  BROWSER:
    → The actual browser process (Chromium, Firefox, or WebKit).
    → You launch ONE browser instance per test run (usually).
    → Has no cookies, no storage by itself — that's the Context's job.

  BROWSERCONTEXT:
    → A completely ISOLATED browsing session INSIDE the browser.
    → Has its OWN: cookies, localStorage, sessionStorage, cache, permissions.
    → Like an incognito window in normal browsing — isolated from others.
    → You can have MULTIPLE contexts in one browser (different users!).
    → This is why Playwright can test multi-user scenarios in one test.

  PAGE:
    → A single browser TAB inside a BrowserContext.
    → Has its own URL, DOM, JavaScript runtime.
    → You can have MULTIPLE pages (tabs) in one context.
    → Pages SHARE cookies/storage within the same context.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  REAL-WORLD ANALOGY:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BROWSER    = A building (the browser application)
  CONTEXT    = A separate office on each floor (isolated user session)
  PAGE       = A desk inside the office (a single browser tab)

  Just as employees on different floors can't see each other's work,
  BrowserContexts cannot see each other's cookies or session data.
  But desks in the SAME office (pages in the same context) share the
  office's resources (cookies, localStorage).

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHY THIS ARCHITECTURE MATTERS FOR TESTING:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Use Case 1 — Test isolation:
    Each test gets its OWN BrowserContext.
    Test A's login cookie never leaks into Test B.
    Tests are independent and can run in parallel safely.

  Use Case 2 — Multi-user testing:
    Create Context1 (Admin user logged in) +
           Context2 (Regular user logged in)
    Both run in SAME browser simultaneously.
    Perfect for testing admin actions affect regular user's view.

  Use Case 3 — Multi-tab testing:
    page1 = checkout tab, page2 = payment tab — in same context.
    Both pages share the same session (same login cookies).
*/




// ================================================================================
//  SECTION 3: LAUNCHING A BROWSER
// ================================================================================

/*
  Playwright supports THREE browser engines:
  ┌──────────────┬────────────────────────────────────┬─────────────────┐
  │   Engine     │          Based On                  │  Represents     │
  ├──────────────┼────────────────────────────────────┼─────────────────┤
  │  chromium    │  Open-source Chromium project       │  Chrome / Edge  │
  │  firefox     │  Mozilla Firefox                    │  Firefox        │
  │  webkit      │  WebKit (open-source Safari engine) │  Safari         │
  └──────────────┴────────────────────────────────────┴─────────────────┘

  NOTE: Playwright does NOT use the actual installed Chrome/Firefox.
        It uses its OWN BUNDLED browser binaries (downloaded with npm install).
        This ensures consistent behavior across machines.
        Run:  npx playwright install   ← downloads all 3 browsers
*/

// ─────────────────────────────────────────────────────────────────
// STANDALONE LIBRARY USAGE (without @playwright/test runner)
// Useful for scripts, utilities, non-test automation
// ─────────────────────────────────────────────────────────────────
const { chromium, firefox, webkit } = require('playwright');
// OR from '@playwright/test' package — same API

async function launchBrowserExamples() {

  // ── Launch Chromium ──────────────────────────────────────────
  const chromiumBrowser = await chromium.launch();
  // ↑ Returns a Browser object.
  // Default: headless: true (no visible browser window)

  // ── Launch Firefox ───────────────────────────────────────────
  const firefoxBrowser = await firefox.launch();

  // ── Launch WebKit ────────────────────────────────────────────
  const webkitBrowser = await webkit.launch();

  // ── Launch HEADED (visible browser window) ───────────────────
  const headedBrowser = await chromium.launch({ headless: false });
  // headless: false → you SEE the browser open on screen

  // Always close browsers when done!
  await chromiumBrowser.close();
  await firefoxBrowser.close();
  await webkitBrowser.close();
  await headedBrowser.close();
}


// ─────────────────────────────────────────────────────────────────
// USING PLAYWRIGHT TEST RUNNER (the standard way for tests)
// ─────────────────────────────────────────────────────────────────
const { test, expect } = require('@playwright/test');

// In test runner, you access browser via fixtures (no manual launch needed)
test('basic browser access via fixture', async ({ page, browser, context }) => {
  // 'page'    → auto-created Page in a new Context
  // 'browser' → the Browser instance
  // 'context' → the BrowserContext for this test
  // Playwright Test runner handles launch/close automatically!

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});




// ================================================================================
//  SECTION 4: BROWSER LAUNCH OPTIONS (Deep Dive)
// ================================================================================

/*
  chromium.launch(options) accepts a LaunchOptions object.
  These options control HOW the browser starts.
*/

async function browserLaunchOptionsDemo() {
  // ─────────────────────────────────────────────────────────────
  // OPTION 1: headless (boolean, default: true)
  // ─────────────────────────────────────────────────────────────
  /*
    headless: true  → Browser runs in BACKGROUND. No GUI window visible.
                      FASTER. Used in CI/CD pipelines.
    headless: false → Browser WINDOW appears on screen.
                      Used for DEBUGGING, demo recording, visual verification.

    INTERVIEW TIP: In production CI, always use headless: true for speed.
    For debugging locally, use headless: false so you can watch execution.
  */
  const headlessBrowser = await chromium.launch({ headless: true });  // CI mode
  const headedBrowser   = await chromium.launch({ headless: false }); // Debug mode

  // ─────────────────────────────────────────────────────────────
  // OPTION 2: slowMo (number in milliseconds, default: 0)
  // ─────────────────────────────────────────────────────────────
  /*
    slowMo: 500 → Adds a 500ms DELAY between every Playwright action.
    WHY?
    - Slows down test execution so you can visually follow what's happening.
    - Great for demo recordings or debugging race conditions.
    - In headless mode, slowMo has no visual effect (but still adds delay).

    REAL USE: When recording a test demo for stakeholders, use:
    { headless: false, slowMo: 1000 }  ← 1 second between each action
  */
  const slowBrowser = await chromium.launch({
    headless: false,
    slowMo: 500  // ← 500ms pause between each action
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 3: args (array of strings)
  // ─────────────────────────────────────────────────────────────
  /*
    args: Pass Chromium/Firefox command-line flags to the browser process.
    Common args for testing:
  */
  const browserWithArgs = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',              // Required in Docker/Linux CI environments
      '--disable-setuid-sandbox',  // Required in Docker
      '--disable-gpu',             // Disable GPU rendering (useful in headless)
      '--disable-dev-shm-usage',   // Fix for Docker memory issues
      '--window-size=1920,1080',   // Set browser window size
      '--disable-web-security',    // Allow cross-origin requests (for testing)
      '--ignore-certificate-errors', // Skip SSL certificate errors
    ]
  });

  /*
    IMPORTANT: '--no-sandbox' and '--disable-setuid-sandbox'
    These are REQUIRED when running Playwright in:
    - Docker containers
    - GitHub Actions
    - Jenkins CI
    - Any Linux environment without proper sandbox setup
    Without these, Chrome will FAIL TO LAUNCH in Docker!
  */

  // ─────────────────────────────────────────────────────────────
  // OPTION 4: devtools (boolean, default: false)
  // ─────────────────────────────────────────────────────────────
  /*
    devtools: true → Opens Chrome DevTools panel AUTOMATICALLY when browser launches.
    Only works with headless: false (can't show DevTools in headless mode).
    Useful for debugging: inspect elements, view console, network tab.
  */
  const devtoolsBrowser = await chromium.launch({
    headless: false,
    devtools: true  // ← DevTools opens automatically
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 5: executablePath (string)
  // ─────────────────────────────────────────────────────────────
  /*
    By default, Playwright uses its BUNDLED browsers.
    Use executablePath to point to YOUR OWN Chrome installation.
    Use case: testing with a specific browser version.
  */
  const customBrowser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 6: timeout (number in ms, default: 30000)
  // ─────────────────────────────────────────────────────────────
  /*
    Maximum time to wait for browser to launch.
    If browser doesn't start within this time → throws TimeoutError.
  */
  const timedBrowser = await chromium.launch({ timeout: 60000 }); // 60 seconds

  // ─────────────────────────────────────────────────────────────
  // OPTION 7: downloadsPath (string)
  // ─────────────────────────────────────────────────────────────
  /*
    Specify where downloads should be saved.
  */
  const browserWithDownloads = await chromium.launch({
    downloadsPath: 'C:\\TestDownloads'
  });

  // ─────────────────────────────────────────────────────────────
  // COMBINED EXAMPLE: All common options together
  // ─────────────────────────────────────────────────────────────
  const fullyConfiguredBrowser = await chromium.launch({
    headless: false,
    slowMo: 100,
    devtools: false,
    args: ['--start-maximized'],
    timeout: 30000,
  });

  // Close all
  await headlessBrowser.close();
  await headedBrowser.close();
  await slowBrowser.close();
  await browserWithArgs.close();
  await devtoolsBrowser.close();
  await customBrowser.close();
  await timedBrowser.close();
  await browserWithDownloads.close();
  await fullyConfiguredBrowser.close();
}




// ================================================================================
//  SECTION 5: CREATING A BROWSERCONTEXT
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT IS A BROWSERCONTEXT?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BrowserContext is Playwright's way of creating a completely ISOLATED
  browsing environment. Think of it as a separate user profile.

  Each BrowserContext has its OWN:
  ✔ Cookies               (login sessions are isolated)
  ✔ localStorage          (stored data is isolated)
  ✔ sessionStorage        (session data is isolated)
  ✔ IndexedDB             (browser database is isolated)
  ✔ Cache                 (network cache is isolated)
  ✔ Permissions           (camera, microphone, geolocation)
  ✔ Service Workers       (isolated PWA state)
  ✔ HTTP Auth credentials

  This means:
  → Context A logs in as admin → Context B is still not logged in.
  → They run in the SAME browser process (efficient) but are FULLY isolated.
*/

async function browserContextDemo() {
  const browser = await chromium.launch({ headless: false });

  // ─────────────────────────────────────────────────────────────
  // Creating a basic context with NO options
  // ─────────────────────────────────────────────────────────────
  const context = await browser.newContext();
  // ↑ Creates a new isolated browsing session

  const page = await context.newPage();
  await page.goto('https://example.com');

  // You can create MULTIPLE contexts from ONE browser:
  const context1 = await browser.newContext(); // User A (e.g., Admin)
  const context2 = await browser.newContext(); // User B (e.g., Customer)
  // context1 and context2 are COMPLETELY isolated from each other

  // Always close properly:
  await context.close();
  await context1.close();
  await context2.close();
  await browser.close();
}




// ================================================================================
//  SECTION 6: CONTEXT OPTIONS (Detailed)
// ================================================================================

async function contextOptionsDemo() {
  const browser = await chromium.launch({ headless: false });

  // ─────────────────────────────────────────────────────────────
  // OPTION 1: viewport
  // ─────────────────────────────────────────────────────────────
  /*
    Sets the browser window size (width x height in pixels).
    This affects what the website "sees" as screen size — determines
    whether mobile or desktop layout is rendered (responsive design).

    Common viewports:
    { width: 1920, height: 1080 }  ← Full HD Desktop
    { width: 1280, height: 720 }   ← HD Desktop
    { width: 768, height: 1024 }   ← iPad (tablet)
    { width: 375, height: 667 }    ← iPhone 8 (mobile)
    { width: 390, height: 844 }    ← iPhone 14 (mobile)
    null                           ← No viewport (full browser size)
  */
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 2: locale
  // ─────────────────────────────────────────────────────────────
  /*
    Sets the browser's LANGUAGE/LOCALE setting.
    Affects:
    - Date/number formatting (e.g., comma vs period as decimal separator)
    - Language of browser-generated UI (e.g., error messages)
    - Accept-Language HTTP header sent to servers
    - navigator.language JavaScript property

    Use cases:
    - Test that your app shows correct date format for German users
    - Test that price shows ₹ for Indian locale
    - Test multi-language support
  */
  const germanContext = await browser.newContext({ locale: 'de-DE' });
  const indianContext = await browser.newContext({ locale: 'en-IN' });
  const japaneseContext = await browser.newContext({ locale: 'ja-JP' });

  // ─────────────────────────────────────────────────────────────
  // OPTION 3: timezone
  // ─────────────────────────────────────────────────────────────
  /*
    Sets the browser's TIMEZONE.
    Affects:
    - new Date() in JavaScript running in the page
    - Time display on the webpage
    - Time-sensitive test scenarios

    Use cases:
    - Test that "Good Morning" vs "Good Evening" greetings work correctly
    - Test that event shows correct local time for users in different zones
    - Test checkout with time-limited offers

    Timezone IDs follow the IANA timezone format:
    'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', etc.
  */
  const nycContext = await browser.newContext({ timezoneId: 'America/New_York' });
  const indiaContext = await browser.newContext({ timezoneId: 'Asia/Kolkata' });

  // ─────────────────────────────────────────────────────────────
  // OPTION 4: permissions
  // ─────────────────────────────────────────────────────────────
  /*
    Grant browser permissions WITHOUT showing the popup dialog.
    In a real browser, when a site asks for "Location access?",
    you'd get a popup. In automated tests, that popup blocks execution.

    permissions: [] ← Grant these permissions automatically.

    Available permissions:
    'geolocation'      ← Location access (GPS)
    'camera'           ← Webcam access
    'microphone'       ← Microphone access
    'notifications'    ← Push notification permission
    'clipboard-read'   ← Read clipboard
    'clipboard-write'  ← Write to clipboard
    'storage-access'   ← Third-party cookie access

    WITHOUT pre-granting: test gets stuck on permission dialog.
    WITH pre-granting: permission is auto-approved, test continues.
  */
  const geoContext = await browser.newContext({
    permissions: ['geolocation', 'notifications']
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 5: geolocation
  // ─────────────────────────────────────────────────────────────
  /*
    Override the browser's GPS location with a FAKE location.
    The website thinks you're at these coordinates.
    Requires 'geolocation' permission to be granted first!

    Use cases:
    - Test location-based features (show restaurants near me)
    - Test country-specific content (show prices in local currency)
    - Test delivery availability for a specific address
    - Test that map centers on correct location

    Coordinates:
    latitude:  -90 to +90  (North is positive, South is negative)
    longitude: -180 to +180 (East is positive, West is negative)
    accuracy:  in meters

    Quick reference:
    Mumbai:     { latitude: 19.0760, longitude: 72.8777 }
    New York:   { latitude: 40.7128, longitude: -74.0060 }
    London:     { latitude: 51.5074, longitude: -0.1278  }
    Tokyo:      { latitude: 35.6762, longitude: 139.6503 }
  */
  const locationContext = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0760, longitude: 72.8777, accuracy: 10 }
    // ↑ Pretending to be in Mumbai, India
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 6: userAgent
  // ─────────────────────────────────────────────────────────────
  /*
    Override the User-Agent string.
    Websites read User-Agent to identify browser type.
    Use case: test mobile-specific behavior, or test User-Agent sniffing logic.
  */
  const customAgentContext = await browser.newContext({
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 7: ignoreHTTPSErrors
  // ─────────────────────────────────────────────────────────────
  /*
    Skip SSL/TLS certificate errors.
    Use case: Testing on STAGING environments with self-signed certificates.
    In production tests, NEVER use this — always verify SSL!
  */
  const insecureContext = await browser.newContext({
    ignoreHTTPSErrors: true  // For staging environments only
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 8: httpCredentials — HTTP Basic Authentication
  // ─────────────────────────────────────────────────────────────
  /*
    Automatically provide HTTP Basic Auth credentials.
    Some staging environments use basic auth before the actual login page.
  */
  const authContext = await browser.newContext({
    httpCredentials: {
      username: 'staginguser',
      password: 'stagingpass'  // ← In real tests, use environment variables!
    }
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 9: storageState — Reuse saved session (login state)
  // ─────────────────────────────────────────────────────────────
  /*
    Load a previously saved authentication state (cookies + localStorage).
    This allows you to SKIP the login step in every test!
    (Covered in detail in Day 13 — Authentication Strategies)
  */
  const loggedInContext = await browser.newContext({
    storageState: './auth/admin-state.json'  // ← pre-saved login state
  });

  // ─────────────────────────────────────────────────────────────
  // OPTION 10: recordVideo — Record test execution as video
  // ─────────────────────────────────────────────────────────────
  /*
    Record everything that happens in the context as a video file.
    Great for debugging failed tests!
  */
  const videoContext = await browser.newContext({
    recordVideo: {
      dir: './test-videos',
      size: { width: 1280, height: 720 }
    }
  });

  // ─────────────────────────────────────────────────────────────
  // COMPLETE EXAMPLE: All context options combined
  // ─────────────────────────────────────────────────────────────
  const fullContext = await browser.newContext({
    viewport:          { width: 375, height: 667 },
    locale:            'en-IN',
    timezoneId:        'Asia/Kolkata',
    permissions:       ['geolocation', 'notifications'],
    geolocation:       { latitude: 19.0760, longitude: 72.8777 },
    userAgent:         'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
    ignoreHTTPSErrors: false,
    httpCredentials:   { username: 'admin', password: process.env.ADMIN_PASS },
    // ↑ SECURITY: NEVER hardcode passwords! Use environment variables.
    recordVideo:       { dir: './videos' },
  });

  await fullContext.close();
  await browser.close();
}




// ================================================================================
//  SECTION 7: CREATING A PAGE
// ================================================================================

/*
  A Page represents ONE browser tab.
  You create pages from a context.
  One context can have multiple pages (multiple tabs in the same session).
*/

async function pageCreationDemo() {
  const browser  = await chromium.launch({ headless: false });
  const context  = await browser.newContext();

  // ─────────────────────────────────────────────────────────────
  // Creating a single page (one tab)
  // ─────────────────────────────────────────────────────────────
  const page = await context.newPage();
  // ↑ Creates a NEW blank tab. URL is 'about:blank' initially.

  console.log('Page URL (before goto):', page.url()); // 'about:blank'

  // ─────────────────────────────────────────────────────────────
  // Accessing page properties
  // ─────────────────────────────────────────────────────────────
  const title   = await page.title();    // Gets the current page title
  const url     = page.url();            // Gets current URL (no await needed)
  const content = await page.content(); // Gets full HTML source as string

  console.log('Title:', title);
  console.log('URL:', url);

  // ─────────────────────────────────────────────────────────────
  // Creating multiple pages (tabs) in same context
  // ─────────────────────────────────────────────────────────────
  const page1 = await context.newPage(); // Tab 1
  const page2 = await context.newPage(); // Tab 2
  const page3 = await context.newPage(); // Tab 3

  // All 3 pages share the SAME cookies (same context = same session)
  await page1.goto('https://google.com');
  await page2.goto('https://github.com');
  await page3.goto('https://stackoverflow.com');

  // Get all pages in the context:
  const allPages = context.pages(); // Returns array of all Page objects
  console.log('Number of open tabs:', allPages.length); // 3

  // Switch between pages (bring tab to front):
  await page2.bringToFront(); // Makes page2 the active/focused tab

  await browser.close();
}




// ================================================================================
//  SECTION 8: NAVIGATING PAGES
// ================================================================================

async function navigationDemo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page    = await context.newPage();

  // ─────────────────────────────────────────────────────────────
  // page.goto(url, options) — Navigate to a URL
  // ─────────────────────────────────────────────────────────────
  /*
    Returns a Response object (or null if navigation didn't result in response).
    WAITS for the page to load (by default waits for 'load' event).
    Auto-waiting: waits until navigation is complete before returning.
  */

  // Basic navigation:
  await page.goto('https://www.google.com');

  // With options:
  const response = await page.goto('https://www.saucedemo.com', {
    waitUntil: 'networkidle',  // Wait until no network requests for 500ms
    timeout: 30000             // Fail if not loaded within 30 seconds
  });
  console.log('Response status:', response.status()); // e.g., 200

  /*
    waitUntil options:
    ┌──────────────────┬─────────────────────────────────────────────────────┐
    │     Value        │               When it resolves                      │
    ├──────────────────┼─────────────────────────────────────────────────────┤
    │ 'commit'         │ When response headers received (earliest)           │
    │ 'domcontentloaded│ When HTML is parsed (DOM ready, no CSS/images yet)  │
    │ 'load'           │ When page + all resources loaded (default)          │
    │ 'networkidle'    │ When no network requests for ≥500ms (latest)        │
    └──────────────────┴─────────────────────────────────────────────────────┘

    CHOOSING THE RIGHT waitUntil:
    - 'load'         → Use for most cases (DEFAULT — balanced)
    - 'domcontentloaded' → Use for FAST pages or SPAs (lighter wait)
    - 'networkidle'  → Use for pages with AJAX/lazy loading (thorough wait)
    - 'commit'       → Use for just checking redirect status
  */

  // ─────────────────────────────────────────────────────────────
  // page.reload() — Refresh the current page
  // ─────────────────────────────────────────────────────────────
  /*
    Equivalent to pressing F5 / Ctrl+R in browser.
    Use case: Test that page retains state after refresh.
             Test real-time data updates.
  */
  await page.reload();
  await page.reload({ waitUntil: 'networkidle' }); // Wait fully after reload

  // ─────────────────────────────────────────────────────────────
  // page.goBack() — Navigate back (browser Back button)
  // ─────────────────────────────────────────────────────────────
  /*
    Returns null if there's no previous page in history.
    Returns Response if navigation happened.
    Use case: Test back navigation (e.g., checkout → back to cart).
  */
  await page.goto('https://example.com/page1');
  await page.goto('https://example.com/page2');
  await page.goBack();  // Goes back to page1
  console.log('After back:', page.url()); // https://example.com/page1

  // ─────────────────────────────────────────────────────────────
  // page.goForward() — Navigate forward (browser Forward button)
  // ─────────────────────────────────────────────────────────────
  await page.goForward(); // Goes forward to page2
  console.log('After forward:', page.url()); // https://example.com/page2

  // ─────────────────────────────────────────────────────────────
  // Checking page URL and title after navigation
  // ─────────────────────────────────────────────────────────────
  await page.goto('https://playwright.dev');
  const currentURL   = page.url();            // Synchronous — no await
  const currentTitle = await page.title();    // Asynchronous — needs await
  console.log('URL:', currentURL);
  console.log('Title:', currentTitle);

  // ─────────────────────────────────────────────────────────────
  // Waiting for URL to change (useful after form submission / redirect)
  // ─────────────────────────────────────────────────────────────
  await page.goto('https://saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html'); // Wait until URL changes
  console.log('Redirected to:', page.url());

  await browser.close();
}




// ================================================================================
//  SECTION 9: PAGE LIFECYCLE EVENTS
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BROWSER PAGE LOADING — WHAT HAPPENS INTERNALLY?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  When you type a URL and press Enter, here's the timeline:

  [0ms]     → Browser sends HTTP request to server
  [100ms]   → Server responds with HTML bytes
  [200ms]   → Browser starts PARSING HTML (builds DOM tree)
  [300ms]   → ⭐ DOMContentLoaded EVENT fires
             (DOM is ready! JS in <script defer> can run now)
             (But images, stylesheets, iframes still loading)
  [400ms]   → Images start loading
  [600ms]   → Stylesheets loaded, page visually renders
  [700ms]   → ⭐ load EVENT fires
             (Everything on the page has loaded)
             (Safest point to start interacting with page)
  [1000ms]  → AJAX calls from page scripts start/finish
  [1500ms]  → No more network activity for 500ms
  [1500ms]  → ⭐ networkidle STATE reached
             (Page is completely done with ALL network activity)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  THE THREE LIFECYCLE EVENTS:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. 'domcontentloaded'
     → HTML parsed, DOM tree built.
     → Scripts marked 'defer' have run.
     → Images/CSS not necessarily loaded yet.
     → FASTEST wait — good for SPA frameworks (React/Vue/Angular)
        where JS builds the UI dynamically.

  2. 'load'
     → Everything in the HTML including images, CSS, scripts loaded.
     → The traditional "page is ready" signal.
     → DEFAULT in Playwright's page.goto().
     → Good for MOST pages.

  3. 'networkidle'
     → No network requests for 500ms (Playwright uses 500ms threshold).
     → Page has finished ALL async API calls.
     → MOST RELIABLE for pages that fetch data after initial load.
     → SLOWEST — use only when necessary.
     → Risk: endless trackers/analytics can prevent networkidle from firing!
*/

async function lifecycleEventsDemo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page    = await context.newPage();

  // ─────────────────────────────────────────────────────────────
  // Using waitUntil with goto
  // ─────────────────────────────────────────────────────────────
  await page.goto('https://saucedemo.com', { waitUntil: 'domcontentloaded' });
  // ↑ Resolves as soon as DOM is ready — fastest

  await page.goto('https://saucedemo.com', { waitUntil: 'load' });
  // ↑ Resolves when page and all resources loaded — balanced (default)

  await page.goto('https://saucedemo.com', { waitUntil: 'networkidle' });
  // ↑ Resolves when no network activity for 500ms — most thorough

  // ─────────────────────────────────────────────────────────────
  // page.waitForLoadState() — Wait for load state AFTER navigation
  // ─────────────────────────────────────────────────────────────
  /*
    Use this when you're NOT using page.goto() (e.g., after a button click
    that causes navigation, or after page.reload()).
  */
  await page.goto('https://saucedemo.com');
  await page.locator('#login-button').click(); // Causes navigation
  await page.waitForLoadState('networkidle');  // Wait for new page to settle

  // ─────────────────────────────────────────────────────────────
  // Listening to lifecycle events with page.on()
  // ─────────────────────────────────────────────────────────────
  /*
    You can LISTEN to page events using page.on('eventname', callback).
    These are useful for logging, debugging, or triggering actions.
  */

  page.on('domcontentloaded', () => {
    console.log('DOM is ready! URL:', page.url());
  });

  page.on('load', () => {
    console.log('Page fully loaded! URL:', page.url());
  });

  // Other useful page events:
  page.on('console', (msg) => {
    console.log('Browser console:', msg.type(), msg.text());
  });

  page.on('pageerror', (error) => {
    console.error('Page JavaScript error:', error.message);
  });

  page.on('requestfailed', (request) => {
    console.warn('Request failed:', request.url(), request.failure());
  });

  page.on('dialog', async (dialog) => {
    console.log('Dialog appeared:', dialog.type(), dialog.message());
    await dialog.accept(); // Auto-accept all dialogs
  });

  await page.goto('https://saucedemo.com');

  await browser.close();
}




// ================================================================================
//  SECTION 10: CLOSING RESOURCES PROPERLY
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHY PROPER RESOURCE CLEANUP IS CRITICAL:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  If you don't close browsers/contexts/pages:
  ✗ Browser processes keep running → memory leak
  ✗ Video/trace files may not be saved properly
  ✗ Temp files accumulate → disk space issues
  ✗ Port conflicts in CI environments
  ✗ Tests interfere with each other (shared state)

  CORRECT ORDER OF CLOSING:
  1. page.close()    ← Close individual tabs first
  2. context.close() ← Close the browsing session
  3. browser.close() ← Close the browser process last

  Like packing up: close documents (pages) → close briefcase (context) → 
  leave the office (close browser)
*/

async function resourceCleanupDemo() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page1   = await context.newPage();
  const page2   = await context.newPage();

  // ─────────────────────────────────────────────────────────────
  // page.close() — Close a single tab
  // ─────────────────────────────────────────────────────────────
  await page1.goto('https://google.com');
  await page2.goto('https://github.com');

  await page1.close(); // Close Tab 1 only
  // page2 is still open
  console.log('Pages still open:', context.pages().length); // 1

  // ─────────────────────────────────────────────────────────────
  // context.close() — Close the entire context (all its pages)
  // ─────────────────────────────────────────────────────────────
  await context.close(); // Closes context AND all its remaining pages
  // page2 is also closed now (belongs to this context)

  // ─────────────────────────────────────────────────────────────
  // browser.close() — Close the browser process
  // ─────────────────────────────────────────────────────────────
  await browser.close(); // Terminates the browser process entirely

  // ─────────────────────────────────────────────────────────────
  // BEST PRACTICE: Use try/finally for guaranteed cleanup
  // ─────────────────────────────────────────────────────────────
  const browser2 = await chromium.launch();
  const context2 = await browser2.newContext();
  const page3    = await context2.newPage();

  try {
    await page3.goto('https://saucedemo.com');
    // ... test steps that might throw errors
    await page3.locator('#login-button').click();
  } catch (err) {
    console.error('Test step failed:', err.message);
  } finally {
    // This ALWAYS runs, even if an error occurred above
    await context2.close();
    await browser2.close();
    console.log('Cleanup complete — browser closed');
  }

  // ─────────────────────────────────────────────────────────────
  // NOTE: In @playwright/test runner, cleanup is AUTOMATIC
  // ─────────────────────────────────────────────────────────────
  /*
    When using the test() function, Playwright handles cleanup for you:

    test('my test', async ({ page }) => {
      // After this test finishes (pass or fail):
      // - page is automatically closed
      // - context is automatically closed
      // - browser is kept open for next test (reused for performance)
      // You DON'T need to call close() manually in test runner!
    });

    Manual cleanup is ONLY needed in standalone scripts (outside test runner).
  */
}




// ================================================================================
//  SECTION 11: MULTIPLE CONTEXTS AND PAGES (TABS)
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SCENARIO: Testing a chat app where Admin sends message → User sees it
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

test('multi-context test: admin and user interaction', async ({ browser }) => {
  // Create two SEPARATE contexts (two different users)
  const adminContext = await browser.newContext();
  const userContext  = await browser.newContext();

  // Create a page (tab) in each context
  const adminPage = await adminContext.newPage();
  const userPage  = await userContext.newPage();

  // Admin logs in
  await adminPage.goto('https://app.example.com/login');
  await adminPage.locator('#email').fill('admin@example.com');
  await adminPage.locator('#password').fill('adminpass');
  await adminPage.locator('[type="submit"]').click();
  await adminPage.waitForURL('**/admin/dashboard');

  // User logs in (different session — different context)
  await userPage.goto('https://app.example.com/login');
  await userPage.locator('#email').fill('user@example.com');
  await userPage.locator('#password').fill('userpass');
  await userPage.locator('[type="submit"]').click();
  await userPage.waitForURL('**/dashboard');

  // Admin sends a message
  await adminPage.goto('https://app.example.com/admin/messages');
  await adminPage.locator('#message-input').fill('Hello from Admin!');
  await adminPage.locator('#send-btn').click();

  // User checks their inbox
  await userPage.goto('https://app.example.com/messages');
  await expect(userPage.locator('.message-item').first()).toContainText('Hello from Admin!');

  // Cleanup
  await adminContext.close();
  await userContext.close();
});


// ─────────────────────────────────────────────────────────────────────────────
// MULTIPLE TABS in the SAME context
// ─────────────────────────────────────────────────────────────────────────────

test('multi-tab test: cart persists across tabs', async ({ context }) => {
  const shopPage     = await context.newPage();
  const productPage  = await context.newPage();
  const cartPage     = await context.newPage();

  // Add item to cart on shop page
  await shopPage.goto('https://saucedemo.com/inventory.html');
  await shopPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Open product detail in another tab (same session/cookies)
  await productPage.goto('https://saucedemo.com/inventory-item.html?id=4');

  // Verify cart count is shared across tabs (same session = same cart)
  await cartPage.goto('https://saucedemo.com/cart.html');
  await expect(cartPage.locator('.cart-item')).toHaveCount(1);

  // ─────────────────────────────────────────────────────────────
  // Handling POPUP windows (new tab opened by clicking a link)
  // ─────────────────────────────────────────────────────────────
  /*
    When a link has target="_blank", it opens a new tab.
    Playwright captures it with page.waitForEvent('popup').
  */
  const page = await context.newPage();
  await page.goto('https://example.com');

  // Start waiting for popup BEFORE clicking (race condition prevention)
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),          // Wait for new tab to open
    page.locator('a[target="_blank"]').click() // Click link that opens new tab
  ]);

  // 'popup' is the new Page object for the new tab
  await popup.waitForLoadState('load');
  console.log('New tab URL:', popup.url());
  await expect(popup).toHaveTitle(/Some Title/);
});




// ================================================================================
//  SECTION 12: INCOGNITO / ISOLATED CONTEXTS
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  KEY FACT: In Playwright, EVERY BrowserContext IS already incognito!
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  By default, Playwright creates contexts with:
  ✔ No cookies (fresh session every time)
  ✔ No localStorage (nothing persisted)
  ✔ No browser history
  ✔ No saved passwords
  ✔ No extensions

  This is EXACTLY what "incognito mode" does in a real browser!
  So every Playwright context is inherently incognito.

  THERE IS NO SEPARATE 'incognito' FLAG — it's the default behavior.

  When you DO want to load a saved session (persistent state), you use:
  storageState: './auth/user-state.json'

  So in Playwright:
  → No storageState = fresh/incognito session (default)
  → With storageState = persistent/logged-in session

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW TO SAVE AND RESTORE SESSION STATE:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// Step 1: Login once and SAVE the state
test('save login state to file', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('**/inventory.html');

  // Save cookies + localStorage to a JSON file
  await page.context().storageState({ path: './auth/saucedemo-auth.json' });
  console.log('Session state saved!');
});

// Step 2: REUSE the saved state in subsequent tests
test('test with pre-loaded session (skip login)', async ({ browser }) => {
  // Create context with saved auth state
  const context = await browser.newContext({
    storageState: './auth/saucedemo-auth.json'  // Load cookies/storage
  });
  const page = await context.newPage();

  // Directly navigate to protected page — NO login needed!
  await page.goto('https://saucedemo.com/inventory.html');

  // Verify we're logged in
  await expect(page.locator('.inventory_list')).toBeVisible();
  await context.close();
});




// ================================================================================
//  SECTION 13: DEVICE EMULATION USING devices DICTIONARY
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  WHAT IS DEVICE EMULATION?
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Device emulation makes a desktop browser PRETEND to be a mobile device by:
  1. Setting the screen resolution to match the device
  2. Setting the device pixel ratio (DPR) — retina displays
  3. Setting the User-Agent string to the device's UA
  4. Enabling touch events (touchscreen simulation)
  5. Setting mobile-specific headers

  WHY USE IT?
  - Test responsive design without needing physical devices
  - Verify mobile layouts render correctly
  - Test touch interactions, swipe, tap
  - Test that mobile users get the right content/features
  - Much faster than using actual devices or device farms

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  THE devices DICTIONARY:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Playwright ships with a built-in 'devices' dictionary containing
  pre-configured settings for 50+ popular devices.
  
  Import: const { devices } = require('@playwright/test');
  
  Each entry in 'devices' contains:
  {
    userAgent:        '...phone user agent string...',
    viewport:         { width: 390, height: 844 },
    deviceScaleFactor: 3,    ← Retina/high-DPI (3x pixel density)
    isMobile:         true,  ← Enables mobile-mode behavior
    hasTouch:         true,  ← Enables touch events
  }
*/

const { devices } = require('@playwright/test');

// View what a device preset looks like:
const iphoneSettings = devices['iPhone 14'];
/*
  iphoneSettings = {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)...',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'webkit'  ← iPhone uses Safari (WebKit)!
  }
*/

// ─────────────────────────────────────────────────────────────────────────────
// Using device emulation in tests
// ─────────────────────────────────────────────────────────────────────────────

test('test on iPhone 14 emulation', async ({ browser }) => {
  // Spread device settings into context options
  const context = await browser.newContext({
    ...devices['iPhone 14'],          // ← Spread ALL device settings
    locale: 'en-US',                  // You can add extra options too
  });
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com');

  // Verify mobile layout is shown
  // (e.g., hamburger menu instead of nav bar)
  await expect(page).toHaveTitle('Swag Labs');

  await context.close();
});

test('test on Pixel 7 (Android) emulation', async ({ browser }) => {
  const context = await browser.newContext({
    ...devices['Pixel 7'],
  });
  const page = await context.newPage();
  await page.goto('https://saucedemo.com');
  // ... test steps for Android
  await context.close();
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-device test: run the SAME test on multiple devices
// ─────────────────────────────────────────────────────────────────────────────

const deviceList = [
  'iPhone 14',
  'iPhone 14 Pro Max',
  'Pixel 7',
  'Galaxy S23',
  'iPad Pro 11',
];

// Using a loop to test across all devices:
for (const deviceName of deviceList) {
  test(`Login page renders correctly on ${deviceName}`, async ({ browser }) => {
    const context = await browser.newContext({
      ...devices[deviceName]
    });
    const page = await context.newPage();

    await page.goto('https://saucedemo.com');
    await expect(page.locator('#login-button')).toBeVisible();

    // Take screenshot for visual verification
    await page.screenshot({
      path: `./screenshots/login-${deviceName.replace(/ /g, '_')}.png`
    });

    await context.close();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Popular devices available in Playwright's devices dictionary:
// ─────────────────────────────────────────────────────────────────────────────
/*
  PHONES:
  'iPhone SE'          { width: 375, height: 667, DPR: 2 }
  'iPhone 12'          { width: 390, height: 844, DPR: 3 }
  'iPhone 14'          { width: 390, height: 844, DPR: 3 }
  'iPhone 14 Plus'     { width: 428, height: 926, DPR: 3 }
  'iPhone 14 Pro'      { width: 393, height: 852, DPR: 3 }
  'iPhone 14 Pro Max'  { width: 430, height: 932, DPR: 3 }
  'Pixel 5'            { width: 393, height: 851, DPR: 2.75 }
  'Pixel 7'            { width: 412, height: 915, DPR: 2.625 }
  'Galaxy S8+'         { width: 360, height: 740, DPR: 4 }
  'Galaxy S23'         { width: 360, height: 780, DPR: 3 }

  TABLETS:
  'iPad (gen 7)'       { width: 810, height: 1080, DPR: 2 }
  'iPad Pro 11'        { width: 834, height: 1194, DPR: 2 }
  'iPad Pro 13'        { width: 1024, height: 1366, DPR: 2 }
  'Galaxy Tab S4'      { width: 712, height: 1138, DPR: 2.25 }

  LANDSCAPE VARIANTS:
  'iPhone 14 landscape'         (same but width/height swapped)
  'iPad Pro 11 landscape'       (same but width/height swapped)

  TO SEE ALL DEVICES:
  const { devices } = require('@playwright/test');
  console.log(Object.keys(devices));
*/




// ================================================================================
//  SECTION 14: REAL-TIME SCENARIO
//  Test a Travel Booking Site with Different Device Viewports
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BUSINESS REQUIREMENT:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MakeMyTrip / GoIbibo / similar travel site reports that:
  - 65% of users are on MOBILE devices
  - 20% on TABLET, 15% on DESKTOP
  - Users in different TIMEZONES need to see correct local times for flights
  - Users in India vs US need different currency displays

  TASK: Write a cross-device, cross-locale, cross-timezone test suite that:
  1. Verifies the homepage loads correctly on Desktop, Tablet, and Mobile
  2. Tests that search results show correct timezone for departure/arrival
  3. Tests geolocation-based airport suggestion ("Near you: BOM")
  4. Verifies currency changes based on user locale
  5. Takes screenshots of each layout for visual QA
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// ── Test file structure ───────────────────────────────────────────────────────

const { test: travelTest, expect: travelExpect } = require('@playwright/test');
const { devices: travelDevices } = require('@playwright/test');

// Configuration object for different test scenarios
const TRAVEL_TEST_SCENARIOS = [
  {
    name:       'Desktop Chrome — India',
    viewport:   { width: 1440, height: 900 },
    locale:     'en-IN',
    timezone:   'Asia/Kolkata',
    geo:        { latitude: 19.0896, longitude: 72.8656 }, // Mumbai Airport (BOM)
    currency:   '₹',
    nearbyCity: 'BOM',
  },
  {
    name:       'iPhone 14 — USA (New York)',
    device:     'iPhone 14',
    locale:     'en-US',
    timezone:   'America/New_York',
    geo:        { latitude: 40.6413, longitude: -73.7781 }, // JFK Airport
    currency:   '$',
    nearbyCity: 'JFK',
  },
  {
    name:       'iPad Pro — UK (London)',
    device:     'iPad Pro 11',
    locale:     'en-GB',
    timezone:   'Europe/London',
    geo:        { latitude: 51.4775, longitude: -0.4614 }, // Heathrow Airport (LHR)
    currency:   '£',
    nearbyCity: 'LHR',
  },
];

// Run tests for each scenario
for (const scenario of TRAVEL_TEST_SCENARIOS) {
  travelTest.describe(`Travel Booking — ${scenario.name}`, () => {

    travelTest('Homepage loads with correct layout', async ({ browser }) => {
      // Build context options from scenario
      const contextOptions = {
        locale:      scenario.locale,
        timezoneId:  scenario.timezone,
        permissions: ['geolocation'],
        geolocation: scenario.geo,
        ...(scenario.device ? travelDevices[scenario.device] : { viewport: scenario.viewport })
        // ↑ If device name provided, use device preset; else use custom viewport
      };

      const context = await browser.newContext(contextOptions);
      const page    = await context.newPage();

      try {
        // Navigate to travel site
        await page.goto('https://www.makemytrip.com', { waitUntil: 'domcontentloaded' });

        // Verify page loaded
        travelExpect(page.url()).toContain('makemytrip');

        // Verify currency symbol matches user's locale
        // (in real test: check actual price elements on page)
        // await travelExpect(page.locator('.price-symbol').first()).toContainText(scenario.currency);

        // Verify geolocation-based suggestion
        // await page.locator('#fromCity').click();
        // await travelExpect(page.locator('.nearby-suggestion')).toContainText(scenario.nearbyCity);

        // Take screenshot for visual QA
        await page.screenshot({
          path:     `./screenshots/travel-${scenario.name.replace(/[^a-z0-9]/gi, '_')}.png`,
          fullPage: true,
        });

        console.log(`✓ Scenario passed: ${scenario.name}`);

      } finally {
        await context.close();
      }
    });

    travelTest('Flight search works on this device', async ({ browser }) => {
      const contextOptions = {
        locale:     scenario.locale,
        timezoneId: scenario.timezone,
        ...(scenario.device ? travelDevices[scenario.device] : { viewport: scenario.viewport })
      };

      const context = await browser.newContext(contextOptions);
      const page    = await context.newPage();

      try {
        await page.goto('https://www.makemytrip.com', { waitUntil: 'load' });

        // Fill flight search form
        // (These locators are for demo — actual selectors depend on site)
        // await page.locator('[data-cy="fromCity"]').click();
        // await page.locator('[data-cy="fromCity"] input').fill('Mumbai');
        // await page.locator('[data-cy="toCity"]').click();
        // await page.locator('[data-cy="toCity"] input').fill('Delhi');
        // await page.locator('[data-cy="searchButton"]').click();

        // Verify search results show flight times
        // await page.waitForLoadState('networkidle');
        // await travelExpect(page.locator('.flight-list')).toBeVisible();

        console.log(`✓ Flight search passed: ${scenario.name}`);

      } finally {
        await context.close();
      }
    });

  });
}


// ── ADDITIONAL SCENARIO: Multi-tab booking flow ───────────────────────────────

travelTest('Multi-tab: Compare flights in different tabs', async ({ browser }) => {
  // Using Indian user context
  const context = await browser.newContext({
    locale:    'en-IN',
    timezoneId: 'Asia/Kolkata',
    viewport:  { width: 1280, height: 800 },
  });

  // Open two tabs to compare different routes
  const tab1 = await context.newPage(); // Mumbai → Delhi
  const tab2 = await context.newPage(); // Mumbai → Bangalore

  // Load both search results in parallel using Promise.all
  await Promise.all([
    tab1.goto('https://www.makemytrip.com/flights/'),
    tab2.goto('https://www.makemytrip.com/flights/'),
  ]);

  // Fill search in tab1
  await tab1.bringToFront();
  console.log('Tab 1 ready for Mumbai → Delhi search');

  // Fill search in tab2
  await tab2.bringToFront();
  console.log('Tab 2 ready for Mumbai → Bangalore search');

  // Both tabs are in same context → same session cookies
  console.log('Both tabs share same session:', context.pages().length === 2);

  await context.close();
});




// ================================================================================
//  SECTION 15: INTERVIEW QUESTIONS WITH DETAILED ANSWERS
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTION 1:
  "Explain the difference between Browser, BrowserContext, and Page in Playwright.
   Why is this three-layer architecture important for test isolation?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ANSWER:
  Playwright uses a three-layer architecture:

  BROWSER → The browser application process (Chromium/Firefox/WebKit).
  One browser instance can host multiple contexts efficiently.

  BROWSERCONTEXT → A completely isolated browsing session inside the browser.
  Each context has its own cookies, localStorage, sessionStorage, permissions,
  and cached data. It's essentially an incognito profile. Multiple contexts
  can run in ONE browser process simultaneously, making it resource-efficient.

  PAGE → A single browser tab inside a context. Pages within the same context
  share cookies and session data, just like tabs in the same browser window.

  WHY THIS IS IMPORTANT FOR TEST ISOLATION:
  Without BrowserContext, every test would share the same cookies and session.
  If Test A logs in as admin and Test B runs simultaneously, Test B would
  inherit admin's session — corrupting the test.
  With BrowserContext, each test gets its OWN isolated session, so tests
  can run IN PARALLEL without interfering with each other. This is the
  foundation of Playwright's parallel execution model.

  PRACTICAL EXAMPLE: Multi-user testing
  You can create contextAdmin (logged in as Admin) and contextUser (logged in
  as regular User) in the SAME browser. Admin approves a request → verify
  that User sees the approval immediately. One browser, two isolated sessions.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTION 2:
  "What is the difference between headless and headed mode in Playwright?
   When would you use each?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ANSWER:
  HEADED (headless: false):
  → The browser WINDOW is visible on screen. You can watch the test execute.
  → Uses more system resources (GPU, memory for rendering).
  → Slower due to visual rendering overhead.
  USE WHEN:
  - Debugging a failing test locally (you can see what's happening)
  - Creating test demonstrations for stakeholders
  - Recording test execution videos for reports
  - When the test involves visual verification or screenshots

  HEADLESS (headless: true — DEFAULT):
  → No browser window. Browser runs entirely in memory.
  → Much FASTER — no rendering overhead.
  → Essential for CI/CD pipelines (no display available on servers).
  USE WHEN:
  - Running tests in CI/CD (GitHub Actions, Jenkins, etc.)
  - Running large test suites where speed matters
  - Any automated/unattended execution

  KEY INSIGHT: In Playwright, headless mode is NOT limited — all Playwright
  features work in headless mode. Contrast with older tools where some features
  only worked in headed mode. Playwright can even take screenshots and videos
  in headless mode!

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTION 3:
  "Explain the three page lifecycle events in Playwright: domcontentloaded,
   load, and networkidle. When would you use each?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ANSWER:
  These events fire in ORDER during page loading:

  1. domcontentloaded:
     Fires when the HTML document is PARSED and the DOM tree is built.
     Does NOT wait for images, stylesheets, subframes, or AJAX calls.
     FASTEST of the three.
     USE WHEN: Pages built with JavaScript frameworks (React/Angular/Vue)
     where the framework bootstraps from just the HTML, then JS adds content.
     Also use for speed-critical tests where you only need the DOM to act on.

  2. load:
     Fires when the page AND all its resources (images, CSS, scripts, iframes)
     have finished loading. The traditional "page is ready" event.
     DEFAULT in Playwright's page.goto().
     USE WHEN: Most standard web pages where you need everything loaded.
     Balanced between speed and thoroughness.

  3. networkidle:
     Not a browser event — Playwright's own state. Fires when there have been
     NO network requests for 500ms. Ensures AJAX calls, lazy-loaded content,
     and any background requests are all complete.
     SLOWEST but MOST THOROUGH.
     USE WHEN: Pages that load data asynchronously (dashboards, SPAs that
     fetch from API after initial render). Risk: infinite polling scripts
     (analytics, chat widgets) can prevent networkidle from ever firing.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTION 4:
  "How does device emulation work in Playwright? What does the devices
   dictionary set up, and what are its limitations?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ANSWER:
  Playwright's device emulation sets these parameters:
  1. viewport — screen resolution (width × height in CSS pixels)
  2. deviceScaleFactor (DPR) — pixel density ratio (2 for Retina, 3 for high-DPI)
  3. userAgent — browser's User-Agent string (what server sees)
  4. isMobile — enables mobile-specific browser behaviors
  5. hasTouch — enables touch event simulation (tap, swipe, pinch)

  Usage:
    const context = await browser.newContext({ ...devices['iPhone 14'] });

  The spread operator (...) unpacks all device settings into the context options.

  LIMITATIONS (Important for interviews!):
  ✗ NOT a real device — it's a desktop browser PRETENDING to be mobile.
  ✗ Cannot test hardware-specific bugs (antenna issues, GPS accuracy, battery)
  ✗ CSS rendering differs slightly from real iOS/Android WebViews
  ✗ Touch gestures (swipe, pinch-to-zoom) have limited simulation capability
  ✗ Real network conditions (5G, 2G latency) require additional throttling

  RECOMMENDATION: Use device emulation for:
  - Responsive layout testing (viewport + CSS media queries)
  - Basic touch interaction testing
  - User-Agent based feature detection testing
  Use REAL devices (via BrowserStack, Sauce Labs) for:
  - Release testing, performance testing, hardware-specific bugs

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  QUESTION 5:
  "Why do Playwright tests use async/await everywhere? What would happen
   if you forgot to use 'await' before a Playwright action?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ANSWER:
  Browser automation is inherently ASYNCHRONOUS because:
  - Network requests take variable time
  - Page rendering is not instantaneous
  - DOM mutations happen over time
  - JavaScript execution in browser happens in a separate process

  Playwright communicates with the browser via the Chrome DevTools Protocol
  (CDP) or similar protocols over a WebSocket connection. Each command sent
  to the browser returns a PROMISE — a JavaScript object representing a
  future result.

  'async' marks the test function as one that contains async operations.
  'await' PAUSES the async function until the Promise resolves.

  WHAT HAPPENS WITHOUT 'await':
  If you write: page.goto('https://example.com');  (no await)
  1. page.goto() is called → returns a Promise (navigation not done yet!)
  2. JavaScript engine does NOT wait → IMMEDIATELY runs the next line
  3. Next line: page.locator('#btn').click() → runs while page is still loading
  4. The click fails because the element doesn't exist yet
  5. OR worse: it "succeeds" but on a blank page → false positive / false negative

  The test appears to run but produces UNRELIABLE results.
  ESLint rule 'no-floating-promises' helps catch forgotten awaits.

  ANALOGY: await is like waiting for the pizza delivery to arrive before
  eating it. Without await, you try to eat before the delivery is made.
*/




// ================================================================================
//  SECTION 16: MCQ QUIZ — 10 QUESTIONS
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 1:
  What does BrowserContext isolate from other contexts in Playwright?

  A) Browser executable version
  B) Cookies, localStorage, and session data
  C) Node.js environment variables
  D) Playwright version and test runner

  ANSWER: B
  EXPLANATION: Each BrowserContext has its own cookies, localStorage,
  sessionStorage, and permissions — completely isolated from other contexts.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 2:
  Which method would you use to wait until no network requests have been
  made for 500ms after page navigation?

  A) await page.goto(url, { waitUntil: 'load' })
  B) await page.goto(url, { waitUntil: 'networkidle' })
  C) await page.goto(url, { waitUntil: 'domcontentloaded' })
  D) await page.waitForSelector('body')

  ANSWER: B
  EXPLANATION: 'networkidle' waits until there are no network requests for
  500ms, making it the most thorough wait option.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 3:
  What is the CORRECT order for closing Playwright resources?

  A) browser.close() → context.close() → page.close()
  B) page.close() → context.close() → browser.close()
  C) context.close() → page.close() → browser.close()
  D) Any order works fine

  ANSWER: B
  EXPLANATION: Close from innermost to outermost: pages first (they belong
  to context), then context, then the browser process.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 4:
  You want to test your app as an iPhone 14 user. Which code is correct?

  A) const context = await browser.newContext({ device: 'iPhone 14' });
  B) const context = await browser.newContext({ ...devices['iPhone 14'] });
  C) const context = await browser.newContext({ mobile: 'iPhone 14' });
  D) const context = await browser.launchMobile('iPhone 14');

  ANSWER: B
  EXPLANATION: You must spread (...) the device object from the devices
  dictionary into the context options. Option A would try to use a 'device'
  property which doesn't exist.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 5:
  What is the DEFAULT value of the 'headless' option when launching a browser?

  A) false (headed mode)
  B) null (determined by environment)
  C) true (headless mode)
  D) It depends on the browser type

  ANSWER: C
  EXPLANATION: Playwright defaults to headless: true. You must explicitly set
  headless: false to see the browser window. This default is ideal for CI/CD.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 6:
  How many BrowserContexts can exist inside a single Browser instance
  in Playwright?

  A) Only 1
  B) Maximum of 5
  C) Exactly 2 (for dual-user testing)
  D) Multiple (no hard limit)

  ANSWER: D
  EXPLANATION: A single Browser can host MULTIPLE BrowserContexts. This is
  one of Playwright's key architectural advantages — you can run many isolated
  sessions efficiently in one browser process.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 7:
  Which option would you use to automatically accept geolocation permission
  requests without showing a popup?

  A) geolocation: { accept: true }
  B) permissions: ['geolocation']
  C) allowGeolocation: true
  D) location: { autoAccept: true }

  ANSWER: B
  EXPLANATION: The 'permissions' array in newContext() options pre-grants
  specified permissions. 'geolocation' must be in this array before
  the geolocation spoofing option takes effect.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 8:
  What does the 'slowMo' option do in browser.launch()?

  A) Simulates a slow network connection
  B) Adds a delay in milliseconds between each Playwright action
  C) Slows down browser startup time
  D) Reduces the browser's CPU usage

  ANSWER: B
  EXPLANATION: slowMo adds a specified delay (in ms) between each Playwright
  operation (click, fill, goto, etc.). Useful for visual debugging and demos.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 9:
  Which Playwright lifecycle event fires FIRST when loading a page?

  A) networkidle
  B) load
  C) domcontentloaded
  D) commit

  ANSWER: D (or C in some contexts — commit is earliest, then domcontentloaded)
  EXPLANATION: Order is: commit → domcontentloaded → load → networkidle
  'commit' fires when response headers are received (earliest signal).
  'domcontentloaded' fires after HTML is parsed.
  'load' fires after all resources are loaded.
  'networkidle' fires last, when network is quiet.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MCQ 10:
  In Playwright Test runner, do you need to manually call browser.close()
  after each test?

  A) Yes, always — otherwise browsers accumulate
  B) Only when using multiple contexts
  C) No — the test runner handles cleanup automatically
  D) Only in beforeAll/afterAll hooks

  ANSWER: C
  EXPLANATION: The @playwright/test runner automatically manages the lifecycle
  of browser, context, and page fixtures. When using async ({ page }) => {},
  cleanup happens automatically after each test. Manual close() is only
  needed when using the standalone Playwright library (without test runner).
*/




// ================================================================================
//  SECTION 17: ONE-WORD / SHORT ANSWER QUESTIONS
//  (How Interviewers Ask Them — Q&A Format)
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW INTERVIEWERS ASK THESE (patterns):
  "What is the _____ for _____ in Playwright?"
  "Which method/property/concept is used to _____?"
  "Name the _____ that _____."
  "What do you call _____?"
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Q: What is the Playwright object that represents a browser TAB?
  A: Page

  Q: What is the Playwright object that represents an ISOLATED user session?
  A: BrowserContext

  Q: Which method creates a new browser context?
  A: browser.newContext()

  Q: Which method creates a new page (tab)?
  A: context.newPage()

  Q: What is the default value of headless mode in Playwright?
  A: true

  Q: Which launch option adds delay between actions for debugging?
  A: slowMo

  Q: What keyword is used to pause async function execution until a Promise resolves?
  A: await

  Q: What keyword makes a JavaScript function return a Promise?
  A: async

  Q: What is a Promise in JavaScript?
  A: An object representing the eventual result of an async operation

  Q: What are the three states of a JavaScript Promise?
  A: pending, fulfilled (resolved), rejected

  Q: Which page lifecycle event fires when HTML parsing is complete?
  A: domcontentloaded

  Q: Which page lifecycle event is the DEFAULT in page.goto()?
  A: load

  Q: Which lifecycle state waits for 500ms of no network activity?
  A: networkidle

  Q: Which method navigates the browser to a URL?
  A: page.goto()

  Q: Which method refreshes the current page?
  A: page.reload()

  Q: Which method simulates clicking the browser Back button?
  A: page.goBack()

  Q: Which method simulates clicking the browser Forward button?
  A: page.goForward()

  Q: What is the Playwright object that holds all device presets (iPhone, Pixel, etc.)?
  A: devices (imported from @playwright/test)

  Q: What operator is used to spread device settings into context options?
  A: Spread operator (...) e.g., ...devices['iPhone 14']

  Q: Which property sets the screen resolution of a BrowserContext?
  A: viewport

  Q: What is DPR (Device Pixel Ratio)?
  A: Ratio of device's physical pixels to CSS pixels (e.g., Retina = 2 or 3)

  Q: Which context option sets the TIMEZONE for the browser session?
  A: timezoneId

  Q: Which context option sets the LANGUAGE/REGION of the browser?
  A: locale

  Q: What must you do BEFORE using geolocation spoofing?
  A: Grant 'geolocation' permission (permissions: ['geolocation'])

  Q: What context option is used to skip the login step by loading saved cookies?
  A: storageState

  Q: Which method saves cookies and localStorage to a JSON file?
  A: context.storageState({ path: './file.json' })

  Q: Pages within the SAME context share what?
  A: Cookies, localStorage, sessionStorage (same session)

  Q: Pages in DIFFERENT contexts share what?
  A: Nothing — they are completely isolated

  Q: What Chromium argument is required when running in Docker?
  A: --no-sandbox

  Q: Which browser engine does Playwright use to test Safari behavior?
  A: WebKit

  Q: Which browser does Playwright bundle — Chrome or Chromium?
  A: Chromium (open-source, not Google Chrome itself)

  Q: What event do you listen to for handling a new popup tab?
  A: page.waitForEvent('popup')

  Q: Which method makes a specific page tab the active/focused one?
  A: page.bringToFront()

  Q: What does context.pages() return?
  A: Array of all Page objects in that context

  Q: What JavaScript concept is used to wait for multiple navigations at once?
  A: Promise.all()

  Q: What keyword in JavaScript is used to extract values from an object?
  A: Destructuring (e.g., const { page } = fixtures)

  Q: What is the 'args' option in browser.launch()?
  A: Array of command-line flags passed to the browser process

  Q: What does devtools: true do in launch options?
  A: Automatically opens Chrome DevTools when browser launches

  Q: What is the purpose of the 'try/finally' pattern in Playwright standalone scripts?
  A: Ensures browser.close() is called even if test throws an error (cleanup guarantee)

  Q: What does page.url() return?
  A: Current URL of the page (synchronous — no await needed)

  Q: What does await page.title() return?
  A: Current title of the page (async — needs await)

  Q: What does await page.content() return?
  A: Full HTML source code of the current page as a string

  Q: When is BrowserContext.storageState({ path }) called?
  A: To SAVE the current session (cookies + storage) to a JSON file

  Q: What does 'isMobile: true' in device emulation enable?
  A: Mobile-specific browser behaviors (touch events, mobile viewport behavior)

  Q: What is the difference between page.close() and context.close()?
  A: page.close() closes one tab; context.close() closes the session AND all its pages

  Q: What does 'httpCredentials' in newContext() handle?
  A: HTTP Basic Authentication (username/password for protected pages)

  Q: What does 'ignoreHTTPSErrors: true' allow?
  A: Skip SSL/TLS certificate validation errors (use only for staging environments)

  Q: Which option in newContext() records test execution as a video?
  A: recordVideo: { dir: './path' }
*/




// ================================================================================
//  SECTION 18: HANDS-ON ASSIGNMENT
// ================================================================================

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASSIGNMENT 1 (Beginner): Basic Browser/Context/Page Flow
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Write a standalone Playwright script (NOT using test runner) that:
  1. Launches Chromium in HEADED mode with slowMo: 500
  2. Creates a BrowserContext
  3. Opens a new Page
  4. Navigates to https://www.saucedemo.com
  5. Prints the page title to console
  6. Prints the current URL to console
  7. Navigates to https://example.com
  8. Goes BACK to saucedemo
  9. Goes FORWARD to example.com
  10. Closes page → context → browser (in correct order)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASSIGNMENT 2 (Intermediate): Multi-Context Multi-User Test
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Using @playwright/test runner, write a test that:
  1. Creates TWO BrowserContexts from the same browser
  2. Context1: Log in to https://saucedemo.com as 'standard_user'
  3. Context2: Log in to https://saucedemo.com as 'problem_user'
  4. In Context1: Add "Sauce Labs Backpack" to cart
  5. In Context2: Add "Sauce Labs Bolt T-Shirt" to cart
  6. Verify Context1's cart has 1 item (standard_user's cart)
  7. Verify Context2's cart has 1 item (problem_user's cart)
  8. Verify that Context1 and Context2 are ISOLATED (cart counts are independent)
  9. Close both contexts

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASSIGNMENT 3 (Intermediate): Device Emulation Suite
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Write a parameterized test suite that runs the SAME login test on:
  1. Desktop: 1920×1080 viewport
  2. iPhone 14
  3. Pixel 7
  4. iPad Pro 11

  For each device:
  - Navigate to https://saucedemo.com
  - Verify the login form is visible
  - Take a screenshot saved as 'screenshots/login-<devicename>.png'
  - Verify the page title is "Swag Labs"

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASSIGNMENT 4 (Advanced): Save and Reuse Session State
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Create two test files:

  File 1: setup.spec.js
  - Log in to https://saucedemo.com as 'standard_user'
  - Save the authentication state to './auth/state.json'

  File 2: cart.spec.js
  - Load the saved auth state from './auth/state.json' into a new context
  - Navigate directly to '/inventory.html' (should not need to login)
  - Verify you are logged in by checking '.inventory_list' is visible
  - Add 2 items to cart
  - Navigate to cart page and verify 2 items are present

  BONUS: Measure how much faster the cart test runs when session is pre-loaded
  vs. when login is included.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ASSIGNMENT 5 (Advanced): Locale and Timezone Testing
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Navigate to https://www.timeanddate.com or any clock website.
  Create 3 contexts with different timezones:
  1. Asia/Kolkata (IST +5:30)
  2. America/New_York (EST -5:00)
  3. Europe/London (GMT +0:00)

  For each context:
  - Navigate to the clock page
  - Use page.evaluate(() => new Date().toLocaleTimeString()) to get browser time
  - Verify the time shows a reasonable hour for that timezone
  - (Optional) Take a screenshot

  Verify that all THREE timezones show DIFFERENT times (they should differ
  by the offset between them).
*/




// ================================================================================
//  QUICK REFERENCE CHEAT SHEET — DAY 2
// ================================================================================

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                    DAY 2 CHEAT SHEET                                    │
  ├─────────────────────────────────────────────────────────────────────────┤
  │  HIERARCHY:    Browser → BrowserContext → Page                          │
  │                                                                         │
  │  LAUNCH:       await chromium.launch({ headless, slowMo, args })        │
  │  CONTEXT:      await browser.newContext({ viewport, locale, ... })      │
  │  PAGE:         await context.newPage()                                  │
  │                                                                         │
  │  NAVIGATE:     await page.goto(url, { waitUntil })                      │
  │  RELOAD:       await page.reload()                                      │
  │  BACK:         await page.goBack()                                      │
  │  FORWARD:      await page.goForward()                                   │
  │  WAIT URL:     await page.waitForURL(pattern)                           │
  │                                                                         │
  │  LIFECYCLE:    'domcontentloaded' < 'load' < 'networkidle'              │
  │                                                                         │
  │  DEVICE:       ...devices['iPhone 14']  (spread into context options)   │
  │                                                                         │
  │  CLOSE ORDER:  page.close() → context.close() → browser.close()        │
  │                                                                         │
  │  JS CONCEPTS:                                                           │
  │    async fn   → makes function return a Promise                         │
  │    await      → pauses until Promise resolves                           │
  │    Promise    → represents future async result                          │
  │    Promise.all→ wait for multiple Promises at once (parallel)           │
  │    ...spread  → unpack object into another object                       │
  │    { page }   → destructure fixtures parameter                          │
  │    try/finally→ guarantee cleanup even if error occurs                  │
  └─────────────────────────────────────────────────────────────────────────┘

  ISOLATION RULE:
  Same context  → pages SHARE cookies/session
  Different context → pages are COMPLETELY ISOLATED

  SECURITY REMINDER:
  ✗ NEVER hardcode passwords in test files
  ✓ USE: process.env.PASSWORD  or  dotenv files  or  secret managers
*/

// ================================================================================
//  END OF DAY 2
//  Next: Day 3 — Locators and Selectors (Deep Dive)
// ================================================================================
