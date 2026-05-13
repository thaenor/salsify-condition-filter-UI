import { test, expect } from '@playwright/test';

test.describe('Filter Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('page loads and shows the title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Product Filter');
    });

    test('page loads and shows all 6 products', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Product Filter');
        await expect(page.locator('tbody tr')).toHaveCount(6);
    });

    test('string equals filters products', async ({ page }) => {
        await page.locator('#property-select').selectOption('0'); // Product Name
        await page.locator('#operator-select').selectOption('equals');
        await page.locator('#value-input').fill('Headphones');
        await page.locator('#value-input').press('Enter');

        await expect(page.locator('tbody tr')).toHaveCount(1);
        await expect(page.locator('tbody tr').first()).toContainText('Headphones');
    });

    test('any operator filters without value input', async ({ page }) => {
        await page.locator('#property-select').selectOption('4'); // wireless
        await page.locator('#operator-select').selectOption('any');

        // Value input should not be visible
        await expect(page.locator('#value-input')).toHaveCount(0);
        await expect(page.locator('#multi-input')).toHaveCount(0);

        // Only products 0,1,2 have wireless
        await expect(page.locator('tbody tr')).toHaveCount(3);
    });

    test('enum single select filters products', async ({ page }) => {
        await page.locator('#property-select').selectOption('3'); // category
        await page.locator('#operator-select').selectOption('equals');
        await page.locator('#value-input').selectOption('electronics');

        await expect(page.locator('tbody tr')).toHaveCount(3);
    });

    test('clear resets filter and shows all products', async ({ page }) => {
        // Build a filter first
        await page.locator('#property-select').selectOption('3'); // category
        await page.locator('#operator-select').selectOption('equals');
        await page.locator('#value-input').selectOption('tools');
        await expect(page.locator('tbody tr')).toHaveCount(2);

        // Clear
        await page.getByRole('button', { name: 'Clear' }).click();

        // All products back, operator and value hidden
        await expect(page.locator('tbody tr')).toHaveCount(6);
        await expect(page.locator('#operator-select')).toHaveCount(0);
        await expect(page.locator('#value-input')).toHaveCount(0);
    });

    test('changing operator resets value input', async ({ page }) => {
        await page.locator('#property-select').selectOption('0'); // Product Name
        await page.locator('#operator-select').selectOption('equals');
        await page.locator('#value-input').fill('something');

        // Change operator to contains
        await page.locator('#operator-select').selectOption('contains');

        // Value input should be empty (remounted)
        await expect(page.locator('#value-input')).toHaveValue('');
    });

    test('filter with no matches shows empty state', async ({ page }) => {
        await page.locator('#property-select').selectOption('0'); // Product Name
        await page.locator('#operator-select').selectOption('equals');
        await page.locator('#value-input').fill('NonExistentProduct');
        await page.locator('#value-input').press('Enter');

        await expect(page.locator('tbody tr')).toHaveCount(1);
        await expect(page.locator('tbody')).toContainText('No products to display.');
    });

    test('multi-text "is any of" filters multiple values', async ({ page }) => {
        await page.locator('#property-select').selectOption('0'); // Product Name
        await page.locator('#operator-select').selectOption('in');
        await page.locator('#multi-input').fill('Headphones, Key');
        await page.locator('#multi-input').press('Enter');

        await expect(page.locator('tbody tr')).toHaveCount(2);
    });

    test('invalid number input shows error message', async ({ page }) => {
        await page.locator('#property-select').selectOption('2'); // weight (number type)
        await page.locator('#operator-select').selectOption('greater_than');
        await page.locator('#value-input').press('Enter');

        // Error message should be visible
        await expect(page.locator('[role="alert"]')).toHaveText('Please enter a valid number');

        // Filter should not have applied — all 6 products still shown
        await expect(page.locator('tbody tr')).toHaveCount(6);
    });
});
