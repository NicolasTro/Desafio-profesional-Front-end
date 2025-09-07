import dotenv from 'dotenv';
import { Builder, By, until } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js';

dotenv.config({ path: '.env.local' });

(async function loginAndGoProfile() {
    const edgeDriverPath = process.env.EDGE_DRIVER_PATH;
    if (!edgeDriverPath) {
        console.error('Error: La variable de entorno EDGE_DRIVER_PATH no está configurada.');
        process.exit(2);
    }

    const service = new edge.ServiceBuilder(edgeDriverPath);
    let driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeService(service).build();

    let hadError = false;

    try {
    const base = process.env.E2E_BASE_URL || 'http://localhost:3000';
    const elemTimeout = Number(process.env.E2E_ELEMENT_TIMEOUT_MS || 7000);
    const navTimeout = Number(process.env.E2E_NAV_TIMEOUT_MS || 10000);
    await driver.get(`${base}/login`);

    // Login
    const emailField = await driver.wait(until.elementLocated(By.id('email-input')), elemTimeout);
    const continueButton = await driver.wait(until.elementLocated(By.id('continue-button')), elemTimeout);
        await emailField.sendKeys(process.env.E2E_TEST_EMAIL || 'nikprueba@user.com');
        await continueButton.click();

    const passwordField = await driver.wait(until.elementLocated(By.id('password-input')), elemTimeout);
    const loginButton = await driver.wait(until.elementLocated(By.id('login-button')), elemTimeout);
        await passwordField.sendKeys(process.env.E2E_TEST_PASSWORD || 'Colmillo27!');
        await loginButton.click();

    // Wait for home
    await driver.wait(async () => (await driver.getCurrentUrl()).includes('/home'), navTimeout);

        // Try to click a profile link in the UI
        const profileLinkCandidates = await driver.findElements(By.css('a[href*="/profile"], a[href*="/perfil"], [data-testid="profile-link"], #profile-link'));
        if (profileLinkCandidates.length > 0) {
            await profileLinkCandidates[0].click();
        } else {
            // fallback: navigate directly
            await driver.get(`${base}/profile`);
        }

    // Wait for profile URL
    await driver.wait(async () => (await driver.getCurrentUrl()).includes('/profile'), navTimeout);

        // Basic content check: look for 'perfil' word in body or known selectors
        const bodyText = await driver.findElement(By.css('body')).getText();
        if (!/perfil|profile|mi perfil|mi perfil/i.test(bodyText)) {
            // allow small chance that UI labels differ; try common selectors
            const selectors = ['#profile-page', '.profile', '[data-testid="profile-page"]'];
            let found = false;
            for (const s of selectors) {
                const els = await driver.findElements(By.css(s));
                if (els.length > 0) { found = true; break; }
            }
            if (!found) throw new Error('No se detectó contenido de la vista perfil');
        }

        console.log('Login + navegar a perfil: OK');
    } catch (err) {
        hadError = true;
        console.error('Login->profile test failed:', err);
    } finally {
        try { await driver.quit(); } catch { }
        process.exit(hadError ? 1 : 0);
    }
})();
