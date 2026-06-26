const {test, expect} = require('@playwright/test');

test('demo2', async ({ page }) => {
  await page.goto('https://google.com');
  const title = await page.title();

  console.log('Title of the page is:', title);
    expect(title).toBe('Googlevvv');
}
)


Locators in Playwright
What is a Locator?

A Locator is used to identify (find) web elements on a webpage so that Playwright can perform actions on them.

Once Playwright identifies the element, it can perform actions like:

Click
Type
Select
Check/Uncheck
Hover
Verify text
Verify visibility
Why do we use Locators?

Locators help Playwright interact with web elements such as:

✅ Buttons
✅ Text fields
✅ Password fields
✅ Checkboxes
✅ Radio buttons
✅ Dropdowns
✅ Links
✅ Images
✅ Tables

Without locators, Playwright doesn't know which element you want to interact with.

we can identify elements using different types of locators like:
- CSS Selectors
- XPath
- Text Content
- Attributes
- Role
-default locators (like getByRole, getByText, etc.)

Text Content Locator

A Text Content locator is used to find an element by the text shown on the page.

Example:
```js
const signInButton = page.getByText('Sign In');
await signInButton.click();
```

You can also use partial text or regex:
```js
await page.getByText(/sign in/i).click();
```

This is useful when the element has visible text like buttons, links, headings, or labels.

Real Example

Suppose we have a Login page.

+----------------------------------+
| Login to Your Account            |
|                                  |
| Email:    [______________]       |
| Password: [______________]       |
|                                  |
|       [ Sign In ]                |
+----------------------------------+

We need to identify each element before performing any action.

Element	Action
Email textbox	Enter Email
Password textbox	Enter Password
Sign In button	Click
Playwright Code
const { test } = require('@playwright/test');


const {test, expect} = require('@playwright/test');

test('check google.com', async ({ page }) => {
    await page.goto('https://www.google.com');
    await page.locator('[title="Search"]').fill('Playwright');
    await page.locator('[title="Search"]').press('Enter');
    await page.pause(2000);
    await page.getByTestId('search-results').click()


}

)

test('test', async ({ page }) => {
  await page.goto('https://sauce-demo.myshopify.com/');
  await page.getByRole('link', { name: 'Catalog' }).click();
  await page.getByRole('link', { name: 'Noir jacket Noir jacket £' }).click();
  await expect(page).toHaveURL('https://sauce-demo.myshopify.com/products/noir-jacket');

 });


 Interview Questions
1. What is a Locator?

A locator is used to identify a web element so Playwright can perform actions like clicking, typing, hovering, or validating.

2. Why are Locators important?

Without locators, Playwright cannot identify which element to interact with. Every UI action depends on a locator.

3. What is the difference between locator() and page.fill()?
await page.locator('#user-name').fill('Admin');

creates a reusable locator with auto-waiting and supports chaining.

await page.fill('#user-name', 'Admin');

performs the action directly. While it works, the locator-based approach is preferred for readability and maintainability.

4. What is the difference between CSS selectors and text locators?
CSS selectors identify elements using IDs, classes, attributes, or tag names.
Text locators identify elements based on the visible text users see on the page.
5. Why is getByRole() recommended?

It uses accessibility roles and accessible names, making tests more stable, readable, and aligned with how users interact with the application.

6. What is Playwright Debug Mode?

Debug mode opens the Playwright Inspector and allows step-by-step execution of tests. It helps inspect elements, pause execution, and troubleshoot locator or timing issues.

7. What is auto-waiting?

Auto-waiting means Playwright automatically waits until an element is visible, enabled, and ready before interacting with it, reducing flaky tests and eliminating most manual waits.


npx playwright codegen https://sauce-demo.myshopify.com/     