import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const rootDir = path.resolve(process.cwd(), '..');
const defaultArtifactsDir = path.join(rootDir, 'output', 'playwright');

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const nextValue = argv[index + 1];

    if (!nextValue || nextValue.startsWith('--')) {
      parsed[key] = 'true';
      continue;
    }

    parsed[key] = nextValue;
    index += 1;
  }

  return parsed;
}

function detectBrowserExecutable() {
  const candidates = [
    process.env.PULSE_PLAYWRIGHT_BROWSER_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function waitForHttp(url, timeoutMs = 180000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status >= 400) {
        return;
      }
    } catch (_) {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function ensureTestUser({ springBaseUrl, email, password }) {
  const response = await fetch(`${springBaseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      passwordConfirm: password,
      name: 'PULSE E2E',
      phone: '01012345678',
      isPrivacyAgreed: true,
      shopInfo: {
        name: '바람난왕족발보쌈 범계점',
        address: '경기 안양시 동안구 평촌대로223번길 48',
        category: 'KOREAN',
        customCategory: null,
      },
    }),
  });

  if (response.status === 201) {
    return;
  }

  const body = await response.text();
  throw new Error(`Test user signup failed (${response.status}): ${body}`);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const frontendUrl = args['frontend-url'] || process.env.PULSE_FRONTEND_URL || 'http://127.0.0.1:4173';
  const springBaseUrl = args['spring-url'] || process.env.PULSE_SPRING_URL || 'http://127.0.0.1:8080';
  const fastApiUrl = args['fastapi-url'] || process.env.PULSE_FASTAPI_URL || 'http://127.0.0.1:8000';
  const artifactsDir = args['artifacts-dir'] || process.env.PULSE_PLAYWRIGHT_ARTIFACTS_DIR || defaultArtifactsDir;
  const browserExecutable = detectBrowserExecutable();

  if (!browserExecutable) {
    throw new Error('No supported Chrome or Edge executable was found for Playwright smoke testing.');
  }

  fs.mkdirSync(artifactsDir, { recursive: true });

  await waitForHttp(`${frontendUrl}/`);
  await waitForHttp(`${springBaseUrl}/api/auth/login`);
  await waitForHttp(`${fastApiUrl}/`);

  const email = `pulse-e2e-${Date.now()}@example.com`;
  const password = 'Pulse!2026a';

  await ensureTestUser({ springBaseUrl, email, password });

  const browser = await chromium.launch({
    executablePath: browserExecutable,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1024 },
  });
  const page = await context.newPage();

  try {
    await page.goto(`${frontendUrl}/login`, { waitUntil: 'networkidle' });
    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('login-submit').click();

    await page.waitForURL(/\/dashboard/, { timeout: 120000 });
    await page.getByTestId('dashboard-layout').waitFor({ timeout: 120000 });

    const desktopSidebar = page.getByTestId('sidebar-desktop');
    await desktopSidebar.hover();
    await page.getByTestId('sidebar-desktop-menu-review').click();

    await page.getByTestId('review-management-page').waitFor({ timeout: 120000 });
    await page.getByTestId('review-tab-quick-settings').click();
    await page.getByTestId('review-tab-saved-templates').click();
    await page.getByTestId('review-tab-review-management').click();

    await desktopSidebar.hover();
    await page.getByTestId('sidebar-desktop-logout').waitFor({ state: 'visible', timeout: 30000 });
    await page.getByTestId('sidebar-desktop-logout').click();
    await page.waitForURL(/\/login/, { timeout: 30000 });

    await page.screenshot({
      path: path.join(artifactsDir, 'playwright-smoke-success.png'),
      fullPage: true,
    });
  } catch (error) {
    await page.screenshot({
      path: path.join(artifactsDir, 'playwright-smoke-failure.png'),
      fullPage: true,
    }).catch(() => {});
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
