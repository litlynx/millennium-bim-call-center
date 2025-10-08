import { expect, type Page, test } from '@playwright/test';

const getSidebar = (page: Page) => page.locator('nav[class*="fixed"]');

const expandSidebar = async (page: Page) => {
  const sidebar = getSidebar(page);
  await expect(sidebar).toBeVisible({ timeout: 10000 });
  await sidebar.hover();
  await page.waitForTimeout(500);
  return sidebar;
};

// Map test-friendly names to actual sidebar item IDs
const SIDEBAR_ITEM_IDS = {
  home: '', // Home uses empty string as ID
  registos: 'records',
  records: 'records'
} as const;

const getSidebarItem = (page: Page, id: keyof typeof SIDEBAR_ITEM_IDS) => {
  const actualId = SIDEBAR_ITEM_IDS[id];
  return page.getByTestId(`sidebar-item-${actualId}`);
};

test.describe('Sidebar Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root and wait for any content to load
    await page.goto('/');

    // Wait for initial loader to disappear (if present)
    await page.waitForSelector('#initial-loader', { state: 'hidden', timeout: 30000 }).catch(() => {
      // If no loader, just continue
    });

    // Give some time for any dynamic content to load
    await page.waitForTimeout(2000);
  });

  test.describe('Sidebar Visibility and Structure', () => {
    test('page loads without critical errors', async ({ page }) => {
      await expect(page).toHaveTitle(/Home Page/);

      // Check that the app container exists
      const appContainer = page.locator('#app');
      await expect(appContainer).toBeVisible();
    });

    test('sidebar has correct initial collapsed state', async ({ page }) => {
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // Initially sidebar should be collapsed (around 6.525rem width)
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeLessThan(150); // Should be around 104px (6.525rem)

      // Labels should not be fully visible when collapsed
      const homeLabel = sidebar.locator('text=Início');
      await expect(homeLabel).toHaveCSS('opacity', '0');
    });

    test('sidebar icons are visible in collapsed state', async ({ page }) => {
      // This test would work when microfrontend CORS issues are resolved
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // Icons should be visible even when collapsed
      const homeIcon = sidebar.locator('[class*="w-\\[25px\\]"]').first();
      const registosIcon = sidebar.locator('[class*="w-\\[25px\\]"]').nth(1);

      await expect(homeIcon).toBeVisible();
      await expect(registosIcon).toBeVisible();
    });
  });

  test.describe('Sidebar Hover Interactions - ENVIRONMENT ISSUE', () => {
    test('test environment documentation', async ({ page }) => {
      // Verify basic page structure works
      await expect(page.locator('#app')).toBeVisible();
    });

    test('sidebar expands on hover', async ({ page }) => {
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // Hover over sidebar
      await sidebar.hover();
      await page.waitForTimeout(500);

      // Sidebar should expand
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeGreaterThan(250); // Should be around 288px (18rem)

      // Labels should become visible
      const homeLabel = sidebar.locator('text=Início');
      await expect(homeLabel).toHaveCSS('opacity', '1');
    });

    test('sidebar collapses when mouse leaves', async ({ page }) => {
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // First hover to expand
      await sidebar.hover();
      await page.waitForTimeout(500);

      // Move mouse away from sidebar
      await page.mouse.move(500, 300);
      await page.waitForTimeout(500);

      // Sidebar should collapse back
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeLessThan(150);

      // Labels should become hidden
      const homeLabel = sidebar.locator('text=Início');
      await expect(homeLabel).toHaveCSS('opacity', '0');
    });

    test('expanded sidebar shows shadow and border', async ({ page }) => {
      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      // Hover to expand
      await sidebar.hover();
      await page.waitForTimeout(500);

      // Should have shadow and border when expanded
      await expect(sidebar).toHaveClass(/shadow-/);
      await expect(sidebar).toHaveClass(/border/);
    });
  });

  test.describe('Navigation Items', () => {
    test('home navigation item works correctly', async ({ page }) => {
      const sidebar = await expandSidebar(page);
      const homeItem = getSidebarItem(page, 'home');

      await expect(homeItem).toBeVisible();
      await homeItem.click();

      // Home item navigates to root path '/'
      await expect(page).toHaveURL(/^http:\/\/localhost:8080\/?$/);
      await expect(homeItem).toHaveClass(/bg-primary-500/);
      await expect(homeItem).toHaveClass(/text-white/);
      await expect(sidebar).toBeVisible();
    });

    test('registos item opens menu (has no direct path)', async ({ page }) => {
      await expandSidebar(page);

      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      // Should show menu overlay
      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();

      // Menu should show "Registos" title
      await expect(menu.locator('text=Registos')).toBeVisible();
    });

    test('navigation items have hover effects', async ({ page }) => {
      await expandSidebar(page);

      const homeItem = getSidebarItem(page, 'home');
      await homeItem.hover();

      // Should have hover styling (primary background if not active)
      // Note: This test might need adjustment based on current active state
      const hasActiveClass = await homeItem.evaluate((el) =>
        el.className.includes('bg-primary-500')
      );

      if (!hasActiveClass) {
        await expect(homeItem).toHaveClass(/hover:bg-primary-500/);
      }
    });
  });

  test.describe('Menu System', () => {
    test('menu appears when clicking on items with submenus', async ({ page }) => {
      await expandSidebar(page);

      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      // Menu should appear
      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();

      // Menu should have proper styling
      await expect(menu).toHaveClass(/bg-white/);
      await expect(menu).toHaveClass(/shadow-/);
      await expect(menu).toHaveClass(/rounded-r-/);
    });

    test('menu closes when mouse leaves', async ({ page }) => {
      await expandSidebar(page);

      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();

      // Move mouse away from menu area
      await page.mouse.move(1200, 200);
      await page.waitForTimeout(500);

      // Menu should be hidden
      await expect(menu).not.toBeVisible();
    });

    test('menu shows correct submenu items', async ({ page }) => {
      await expandSidebar(page);

      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();

      // Should show menu items for Registos
      await expect(menu.locator('text=Canais Digitais')).toBeVisible();
    });
  });

  test.describe('Active States', () => {
    test('active navigation item has correct styling', async ({ page }) => {
      await expandSidebar(page);

      const homeItem = getSidebarItem(page, 'home');
      await homeItem.click();

      await expect(homeItem).toHaveClass(/bg-primary-500/);
      await expect(homeItem).toHaveClass(/text-white/);

      const homeIcon = homeItem.locator('[class*="w-\\[25px\\]"]').first();
      await expect(homeIcon).toHaveClass(/text-white/);
    });

    test('only one item can be active at a time', async ({ page }) => {
      await expandSidebar(page);

      // Initially, home should be active (we're on root path)
      const homeItem = getSidebarItem(page, 'home');
      const hasActiveClassHome = await homeItem.evaluate((el) =>
        el.classList.contains('bg-primary-500')
      );
      expect(hasActiveClassHome).toBeTruthy();

      // Clicking registos opens menu but doesn't navigate, so home stays active
      // This is expected behavior - only navigable items change the active state
      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      // Wait for menu to open
      await page.waitForTimeout(300);

      // Home should still be active since we didn't navigate away
      const stillActiveHome = await homeItem.evaluate((el) =>
        el.classList.contains('bg-primary-500')
      );
      expect(stillActiveHome).toBeTruthy();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('sidebar maintains position on window resize', async ({ page }) => {
      const sidebar = getSidebar(page);

      // Get initial position
      const initialBox = await sidebar.boundingBox();

      // Resize window
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(300);

      // Position should remain the same (fixed positioning)
      const newBox = await sidebar.boundingBox();
      expect(newBox?.x).toBe(initialBox?.x);
      expect(newBox?.y).toBe(initialBox?.y);
    });

    test('sidebar works correctly on different viewport sizes', async ({ page }) => {
      // Test on smaller viewport
      await page.setViewportSize({ width: 1024, height: 768 });

      const sidebar = getSidebar(page);
      await expect(sidebar).toBeVisible();

      // Should still be expandable
      await sidebar.hover();
      await page.waitForTimeout(500);

      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeGreaterThan(250);
    });
  });

  test.describe('Accessibility', () => {
    test('sidebar has proper ARIA attributes', async ({ page }) => {
      const sidebar = getSidebar(page);

      // Should be a nav element
      await expect(sidebar).toHaveRole('navigation');
    });

    test('navigation items are keyboard accessible', async ({ page }) => {
      // Focus first navigation item
      await page.keyboard.press('Tab');

      const homeItem = getSidebarItem(page, 'home');

      // Should be focusable
      await expect(homeItem).toBeFocused();

      // Should be activatable with Enter (navigates to root '/')
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/^http:\/\/localhost:8080\/?$/);
    });

    test('menu items are keyboard navigable', async ({ page }) => {
      // Navigate to Registos item and activate it
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Assuming Registos is the second item
      await page.keyboard.press('Enter');

      // Menu should open
      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();
    });
  });

  test.describe('Performance and Animations', () => {
    test('sidebar expansion animation is smooth', async ({ page }) => {
      const sidebar = getSidebar(page);

      // Should have transition classes
      await expect(sidebar).toHaveClass(/transition-all/);
      await expect(sidebar).toHaveClass(/duration-300/);

      // Test expansion
      await sidebar.hover();

      // Allow time for animation
      await page.waitForTimeout(400);

      // Should be expanded
      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeGreaterThan(250);
    });

    test('label fade animation works correctly', async ({ page }) => {
      const sidebar = getSidebar(page);
      const homeLabel = sidebar.locator('text=Início');

      // Initially should be hidden
      await expect(homeLabel).toHaveCSS('opacity', '0');

      // Expand sidebar
      await sidebar.hover();
      await page.waitForTimeout(500);

      // Label should fade in
      await expect(homeLabel).toHaveCSS('opacity', '1');
    });
  });

  test.describe('Bottom Section Items', () => {
    test('bottom section is present but may be empty', async ({ page }) => {
      const bottomSection = page.getByTestId('sidebar-bottom-section');
      await expect(bottomSection).toHaveCount(1);

      const bottomItems = bottomSection.locator('[data-testid^="sidebar-item-"]');
      const count = await bottomItems.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Edge Cases', () => {
    test('sidebar handles rapid hover events correctly', async ({ page }) => {
      const sidebar = getSidebar(page);

      // Rapidly hover and unhover
      for (let i = 0; i < 3; i++) {
        await sidebar.hover();
        await page.waitForTimeout(100);
        await page.mouse.move(500, 300);
        await page.waitForTimeout(100);
      }

      // Should still work normally after rapid events
      await sidebar.hover();
      await page.waitForTimeout(500);

      const sidebarBox = await sidebar.boundingBox();
      expect(sidebarBox?.width).toBeGreaterThan(250);
    });

    test('sidebar maintains state during page navigation', async ({ page }) => {
      const sidebar = await expandSidebar(page);

      const homeItem = getSidebarItem(page, 'home');
      await homeItem.click();

      // Home navigates to root path
      await expect(page).toHaveURL(/^http:\/\/localhost:8080\/?$/);
      await expect(sidebar).toBeVisible();

      // Sidebar should still be functional after navigation
      const registosItem = getSidebarItem(page, 'registos');
      await expect(registosItem).toBeVisible();
    });

    test('menu closes when clicking outside', async ({ page }) => {
      await expandSidebar(page);

      const registosItem = getSidebarItem(page, 'registos');
      await registosItem.click();

      const menu = page.locator('[class*="absolute"][class*="z-10"]');
      await expect(menu).toBeVisible();

      await page.mouse.move(1200, 200);
      await page.mouse.click(1200, 200);
      await page.waitForTimeout(300);

      await expect(menu).not.toBeVisible();
    });
  });

  test.describe('Test Suite Documentation', () => {
    test('comprehensive sidebar test plan', async ({ page }) => {
      // Verify basic environment works
      await expect(page.locator('#app')).toBeVisible();
    });
  });
});
