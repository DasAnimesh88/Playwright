# Built-in Locator and XPath Locator

## Playwright Built-in Locators

Playwright provides several built-in locator methods that are easier to read, less brittle, and often more reliable than raw selectors.

Common built-in locators:

- `page.locator('css=...')` or `page.locator('...')`
  - Uses CSS selector syntax by default.
- `page.locator('text=Login')`
  - Finds elements containing visible text.
- `page.locator('role=button[name="Submit"]')`
  - Finds elements by ARIA role and accessible name.
- `page.locator('button')`, `page.locator('input')`, etc.
  - Finds elements by tag or element type.
- `page.getByText('Submit')`
  - A shorthand for locating elements by visible text.
- `page.getByRole('button', { name: 'Submit' })`
  - Uses accessibility roles and names.
- `page.getByLabel('Email')`
  - Finds inputs by associated label.
- `page.getByPlaceholder('Search')`
  - Finds inputs by placeholder text.
- `page.getByTestId('my-element')`
  - Finds elements using `data-testid` attributes.

Advantages of built-in locators:

- More readable and expressive.
- Better support for accessibility-based testing.
- Can automatically wait for elements to appear.
- Less sensitive to DOM structure changes.

Example:

```js
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('user@example.com');
await page.getByText('Welcome back').isVisible();
```

## XPath Locators

XPath is a path language for selecting nodes in the DOM tree. Playwright supports XPath via `page.locator('xpath=...')` or by passing an XPath expression directly.

Examples:

```js
await page.locator('xpath=//button[text()="Submit"]').click();
await page.locator('//div[@id="main"]//a').click();
```

When to use XPath:

- When CSS selectors cannot express the relationship you need.
- When selecting elements by complex hierarchical structure.
- When you need to navigate up and across the DOM tree.

Drawbacks of XPath:

- Less readable and more verbose than built-in locators.
- More fragile if the page structure changes.
- Harder to maintain for large test suites.

## Built-in Locator vs XPath Locator

- Use built-in locators when possible for cleaner, easier-to-maintain tests.
- Built-in locators often handle waiting automatically and support accessibility queries.
- Use XPath only when a selector cannot be expressed clearly with CSS or the built-in locator helpers.

### Quick comparison

- Readability: built-in locators > XPath
- Maintainability: built-in locators > XPath
- Accessibility support: built-in locators > XPath
- Complex DOM traversal: XPath >= built-in locators

## Example Comparison

Built-in locator:

```js
await page.getByText('Forgot password').click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
```

XPath locator:

```js
await page.locator('xpath=//label[text()="Email"]/following-sibling::input').fill('test@example.com');
```

## Recommendation

Prefer Playwright built-in locators such as `getByRole`, `getByText`, `getByLabel`, and `locator` with CSS selectors. Use XPath only for specific cases where built-in locators are insufficient or when a direct DOM path is required.

## Basic Playwright Q&A

- What is the command to install Playwright?
  - `npm install -D @playwright/test`
  - After installation, initialize browsers with `npx playwright install`
- What is the command to view the report?
  - `npx playwright show-report`
- What is the command to execute in Firefox browser?
  - `npx playwright test --project=firefox`
- What is the command to execute a single file?
  - `npx playwright test path/to/test-file.spec.ts`
- What is the command to debug?
  - `npx playwright test --debug`
  - Or use `PWDEBUG=1 npx playwright test` for the Playwright inspector.
- What is the command to see in UI mode?
  - `npx playwright test --ui`
- What is the command for codegen?
  - `npx playwright codegen <url>`
- What is `page`?
  - In Playwright, `page` represents a single browser tab or window. It is the main object used to interact with the page: navigation, locators, clicks, typing, and assertions.
- What is the folder structure?
  - A typical Playwright project structure includes:
    - `tests/` or `src/` for test files
    - `playwright.config.ts` for configuration
    - `package.json` for project scripts and dependencies
    - `playwright/` for test fixtures or helper files
    - `reports/` for generated HTML reports
- Difference between `npm` and `npx`?
  - `npm` is the Node package manager for installing packages and running scripts.
  - `npx` runs binaries from `node_modules` or downloads temporary executables. It is useful for running local install binaries like `playwright` without a global install.
- What is `async` / `await`?
  - `async` marks a function that returns a promise.
  - `await` pauses execution inside an `async` function until a promise resolves.
  - In Playwright, use `await` before page actions like `await page.goto(url)`.
- What is client-server architecture?
  - Client-server architecture separates a user-facing client from a backend server.
  - The client sends requests and the server responds with data or behavior.
  - In web testing, the browser is the client and the web application backend is the server.
- How to get the title of the page?
  - `await page.title()`
- How to get the URL?
  - `await page.url()`

### Extra basic questions

- What is a locator?
  - A locator is a Playwright object that identifies elements on a page and supports interactions like click, fill, and wait.
- What is a test runner?
  - A test runner executes test files, manages assertions, and reports results. Playwright Test is the built-in runner for Playwright.
- What is a selector?
  - A selector is a string or expression used to find page elements, such as CSS selectors, XPath expressions, or Playwright built-in selector engines.

## Which Locator is Always Preferable and Why?

**`page.getByRole()` is always the most preferable locator when possible.**

### Reasons:

1. **User-Centric Testing**
   - `getByRole` uses ARIA accessibility APIs, which reflect how real users and assistive technologies interact with the page.
   - Tests actual user experience, not implementation details.

2. **Resilience to DOM Changes**
   - Accessibility semantics rarely change; CSS classes and HTML structure change frequently.
   - A button is always a button, even if its CSS class changes.

3. **Accessibility Alignment**
   - Encourages developers to write semantic HTML and proper ARIA labels.
   - Catching accessibility issues early helps all users.

4. **Better Error Messages**
   - Failures are clear: "Could not find button with name 'Submit'" is more useful than CSS selector mismatches.

### Locator Preference Order:

1. **`page.getByRole()`** — Always try this first
2. **`page.getByLabel()`** — For form inputs with labels
3. **`page.getByPlaceholder()`** — For inputs with placeholders
4. **`page.getByText()`** — For visible text content
5. **`page.getByTestId()`** — When you control the markup and add `data-testid`
6. **`page.locator()` with CSS** — Last resort; avoid unless role/label/text won't work
7. **XPath** — Only when nothing else is viable

### Example:

```js
// ✅ BEST: Uses accessibility role
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ GOOD: Uses label association
await page.getByLabel('Email Address').fill('user@example.com');

// ⚠️ OKAY: Uses visible text
await page.getByText('Learn more').click();

// ⚠️ AVOID: Brittle CSS selector
await page.locator('.btn.btn-primary').click();

// ❌ LAST RESORT: XPath
await page.locator('xpath=//button[contains(@class, "btn")]').click();
```

### When `getByRole` Isn't Enough:

- The element lacks a proper ARIA role or accessible name.
- The page uses poor HTML semantics (not your test's fault).
- Fallback to `getByTestId` if you control the codebase—add `data-testid` attributes for testing hooks.

**Golden Rule:** Test like a user. `getByRole` aligns tests with real accessibility and user behavior.



// click a button by accessible name
await page.getByRole('button', { name: 'Submit' }).click();

// case-insensitive / partial match via regex
await page.getByRole('button', { name: /submit/i }).click();

// exact match only
await page.getByRole('button', { name: 'Submit' , exact: true }).click();


// fill a textbox by accessible name
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');

// check / uncheck a checkbox
await page.getByRole('checkbox', { name: 'Accept terms' }).check();
await page.getByRole('checkbox', { name: 'Accept terms' }).uncheck();

// select option in combobox / listbox
await page.getByRole('combobox', { name: 'Country' }).selectOption('IN');
await page.getByRole('listbox', { name: 'City' }).getByRole('option', { name: 'Mumbai' }).click();

// click a link
await page.getByRole('link', { name: 'Documentation' }).click();

// assert a heading exists
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

// open a menu then click an item
await page.getByRole('button', { name: 'More' }).click();
await page.getByRole('menuitem', { name: 'Settings' }).click();

// use regex for flexible matching and partial names
await page.getByRole('button', { name: /save|submit/i }).click();

// scope searches to a container
const form = page.locator('form#login');
await form.getByRole('textbox', { name: 'Email' }).fill('a@b.com');

// get first/last/nth matching role
await page.getByRole('button').first().click();
await page.getByRole('button').nth(2).click();

// check visibility before action
const btn = page.getByRole('button', { name: 'Proceed' });
if (await btn.isVisible()) await btn.click();