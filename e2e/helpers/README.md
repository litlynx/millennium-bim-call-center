\*\*\*\*# E2E Test Helpers

This directory contains shared helper functions for Playwright e2e tests. These helpers promote code reuse, improve test maintainability, and provide consistent testing patterns across the test suite.

## Overview

The helpers are organized into the following categories:

- **Console and Error Logging** - Capture and log console messages, errors, and network failures
- **Navigation** - Navigate between pages using SPA routing
- **Dropdown/Select** - Interact with dropdown filters and select options
- **Date Picker** - Work with complex calendar date pickers (supports PT/EN month names)
- **Table** - Get table rows and interact with tabular data
- **Form** - Fill textareas, clear inputs, manage character counts
- **File Upload** - Upload files, track progress, remove uploaded files
- **Wait and Polling** - Wait for conditions and poll for async operations

## Usage

Import the helpers you need in your test files:

```typescript
import {
  setupConsoleLogging,
  navigateToApplicationErrors,
  selectDropdownOption,
  selectDateRange,
  getTransactionRows,
  fillTextarea,
  uploadFile,
} from "../helpers/test-helpers";
```

## API Reference

### Console and Error Logging

#### `setupConsoleLogging(page, loggedMessages?)`

Set up console message logging for a page. Logs errors, warnings, and page errors to help with debugging.

```typescript
const loggedMessages = new Set<string>();

test.beforeEach(async ({ page }) => {
  setupConsoleLogging(page, loggedMessages);
});
```

**Parameters:**

- `page` - Playwright Page instance
- `loggedMessages` - Optional Set to track already logged messages (prevents duplicates)

#### `captureConsoleLogs(page)`

Capture console log messages for testing. Returns an array that will be populated with log messages.

```typescript
const logs = captureConsoleLogs(page);
await page.click("button");
expect(logs).toContain("Button clicked!");
```

**Returns:** Array of captured log messages

---

### Navigation

#### `navigateToRoute(page, path, waitForSelector?, timeout?)`

Navigate to a route using client-side routing (SPA style). Uses `pushState` instead of full page reload.

```typescript
await navigateToRoute(
  page,
  "/records/digital-channels/mobile-banking/accesses",
  "text=Smart IZI - Acessos",
  20000
);
```

**Parameters:**

- `path` - Path to navigate to
- `waitForSelector` - Optional selector to wait for after navigation
- `timeout` - Timeout for waiting (default: 20000ms)

#### `navigateToApplicationErrors(page)`

Navigate to the Application Errors page.

```typescript
await navigateToApplicationErrors(page);
```

#### `navigateToCancelsBlocked(page)`

Navigate to the Cancels/Blocked page.

```typescript
await navigateToCancelsBlocked(page);
```

#### `navigateToAccesses(page)`

Navigate to the Accesses page.

```typescript
await navigateToAccesses(page);
```

---

### Dropdown / Select Helpers

#### `getFilterTrigger(page, label)`

Get the trigger button for a filter by its label. Useful for filters that have a label followed by a button.

```typescript
const trigger = getFilterTrigger(page, "Tipo de Operação");
await trigger.click();
```

**Returns:** Locator for the filter trigger button

#### `selectDropdownOption(page, label, optionText)`

Select an option from a dropdown filter. Opens the dropdown, selects the option, and verifies it's selected.

```typescript
await selectDropdownOption(page, "Tipo de Operação", "Recarga");
```

**Parameters:**

- `label` - The label of the filter/dropdown
- `optionText` - The text of the option to select

---

### Date Picker Helpers

The date picker helpers support both Portuguese and English month names and handle complex calendar navigation.

#### `selectDateRange(page, start, end, filterLabel?)`

Select a date range in the calendar. Opens the date picker, selects start and end dates, and verifies the selection.

```typescript
const startDate = new Date(2025, 0, 1); // January 1, 2025
const endDate = new Date(2025, 11, 31); // December 31, 2025
await selectDateRange(page, startDate, endDate, "Data");
```

**Parameters:**

- `start` - Start date
- `end` - End date
- `filterLabel` - Label of the date filter (default: 'Data')

#### Lower-level date picker functions

- `parseCalendarCaption(caption)` - Parse calendar caption text (e.g., "Janeiro 2025") to Date
- `getVisibleMonthStart(page)` - Get the currently visible month in the calendar
- `monthDiff(from, to)` - Calculate the difference in months between two dates
- `navigateToMonth(page, target)` - Navigate the calendar to a specific month
- `selectCalendarDay(page, date)` - Select a specific day in the calendar
- `formatDataDayValue(date)` - Format a date for the data-day attribute
- `formatDisplayDate(date)` - Format a date for display (Portuguese format)

---

### Table Helpers

#### `getTransactionRows(page)`

Get all transaction rows from a table.

```typescript
const rows = getTransactionRows(page);
await expect(rows.first()).toBeVisible();
const rowCount = await rows.count();
```

**Returns:** Locator for table body rows

#### `getTransactionRowsFromPanel(page, panelName)`

Get transaction rows from a specific panel/tab.

```typescript
const rows = getTransactionRowsFromPanel(page, "Histórico de Transacções");
await expect(rows.first()).toContainText("Smart IZI");
```

**Parameters:**

- `panelName` - Name of the panel/tab

**Returns:** Locator for table body rows within that panel

---

### Form Helpers

#### `fillTextarea(page, placeholder, text, maxLength?)`

Fill a textarea and verify character count.

```typescript
await fillTextarea(page, "Motivo da Chamada", "Test message", 500);
```

**Parameters:**

- `placeholder` - Placeholder text of the textarea
- `text` - Text to fill in
- `maxLength` - Maximum length to verify against (optional)

#### `clearTextarea(page, placeholder)`

Clear a textarea using the clear button.

```typescript
await clearTextarea(page, "Motivo da Chamada");
```

**Parameters:**

- `placeholder` - Placeholder text of the textarea

---

### File Upload Helpers

#### `uploadFile(page, fileName, mimeType, content)`

Upload a file to a file input.

```typescript
await uploadFile(page, "test.pdf", "application/pdf", "PDF content here");
```

**Parameters:**

- `fileName` - Name of the file
- `mimeType` - MIME type of the file
- `content` - File content as string or buffer

#### `waitForUploadComplete(page, timeout?)`

Wait for file upload to complete (progress bar reaches 100%).

```typescript
await uploadFile(page, "large-file.pdf", "application/pdf", largeContent);
await waitForUploadComplete(page, 10000);
```

**Parameters:**

- `timeout` - Maximum time to wait (default: 5000ms)

#### `removeUploadedFile(page, fileName)`

Remove an uploaded file.

```typescript
await removeUploadedFile(page, "test.pdf");
```

**Parameters:**

- `fileName` - Name of the file to remove

---

### Wait and Polling Helpers

#### `waitFor(checkFn, timeout?, interval?)`

Poll for a condition with a custom checker function. Useful for waiting for async operations to complete.

```typescript
let dataLoaded = false;
await waitFor(() => dataLoaded, 5000, 100);
```

**Parameters:**

- `checkFn` - Function that returns true when condition is met
- `timeout` - Maximum time to wait (default: 5000ms)
- `interval` - Check interval (default: 100ms)

#### `waitForConsoleLog(logs, message, timeout?)`

Wait for a console log message to appear.

```typescript
const logs = captureConsoleLogs(page);
await page.click("button");
await waitForConsoleLog(logs, "Button clicked!", 5000);
```

**Parameters:**

- `logs` - Array of captured logs (from `captureConsoleLogs`)
- `message` - Message text or regex to match
- `timeout` - Maximum time to wait (default: 5000ms)

---

## Best Practices

1. **Import only what you need** - Only import the helpers you're actually using in your test
2. **Use semantic helpers** - Prefer high-level helpers like `selectDateRange` over low-level functions
3. **Setup console logging** - Always use `setupConsoleLogging` in `beforeEach` hooks to capture errors
4. **Reuse patterns** - If you find yourself writing similar helper code in multiple tests, extract it to this file
5. **Document new helpers** - Add JSDoc comments to new helper functions explaining their purpose and parameters

## Contributing

When adding new helpers:

1. Add comprehensive JSDoc documentation
2. Group helpers by category (add new section if needed)
3. Update this README with usage examples
4. Ensure helpers are generic and reusable
5. Export helpers from `test-helpers.ts`

## Examples

### Complete Test Example

```typescript
import { expect, test } from "@playwright/test";
import {
  setupConsoleLogging,
  navigateToApplicationErrors,
  selectDropdownOption,
  selectDateRange,
  getTransactionRows,
  fillTextarea,
} from "../helpers/test-helpers";

const loggedMessages = new Set<string>();

test.describe("Application Errors", () => {
  test.beforeEach(async ({ page }) => {
    setupConsoleLogging(page, loggedMessages);
    await navigateToApplicationErrors(page);
  });

  test("filters transactions by date and type", async ({ page }) => {
    // Select date range
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 0, 31);
    await selectDateRange(page, start, end);

    // Select operation type
    await selectDropdownOption(page, "Tipo de Operação", "Recarga");

    // Verify filtered results
    const rows = getTransactionRows(page);
    await expect(rows.first()).toContainText("Recarga");
  });

  test("submits form with text", async ({ page }) => {
    await fillTextarea(page, "Motivo da Chamada", "Test reason", 500);
    await page.getByRole("button", { name: "Fechar" }).click();
    await expect(page.getByText("Sucesso")).toBeVisible();
  });
});
```

## Migration Guide

If you have existing tests with inline helper functions, here's how to migrate:

### Before (Duplicated Code)

```typescript
const selectDropdownOption = async (
  page: Page,
  label: string,
  optionText: string
) => {
  const trigger = page
    .locator(
      `xpath=//p[normalize-space()="${label}"]/following-sibling::*//button`
    )
    .first();
  await trigger.click();
  const option = page
    .locator('[data-state="open"] li', { hasText: optionText })
    .first();
  await expect(option).toBeVisible();
  await option.click();
};

test("my test", async ({ page }) => {
  await selectDropdownOption(page, "Filter", "Option");
});
```

### After (Using Shared Helper)

```typescript
import { selectDropdownOption } from "../helpers/test-helpers";

test("my test", async ({ page }) => {
  await selectDropdownOption(page, "Filter", "Option");
});
```

## Related Files

- `e2e/tests/application-errors.e2e.ts` - Example usage in Application Errors tests
- `e2e/tests/cancels-blocked.e2e.ts` - Example usage in Cancels/Blocked tests
- `e2e/tests/accesses.e2e.ts` - Example usage in Accesses tests
- `e2e/playwright.config.ts` - Playwright configuration
- `e2e/global-setup.ts` - Global test setup
