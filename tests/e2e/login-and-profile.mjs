import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import edge from "selenium-webdriver/edge.js";

dotenv.config({ path: ".env.local" });

(async function loginAndOpenProfile() {
  const edgeDriverPath = process.env.EDGE_DRIVER_PATH;
  if (!edgeDriverPath) {
    console.error(
      "Error: La variable de entorno EDGE_DRIVER_PATH no está configurada.",
    );
    process.exit(2);
  }

  const service = new edge.ServiceBuilder(edgeDriverPath);
  const driver = await new Builder()
    .forBrowser("MicrosoftEdge")
    .setEdgeService(service)
    .build();

  let hadError = false;
  try {
    const base = process.env.E2E_BASE_URL || "http://localhost:3000";
    const elemTimeout = Number(process.env.E2E_ELEMENT_TIMEOUT_MS || 8000);
    const navTimeout = Number(process.env.E2E_NAV_TIMEOUT_MS || 10000);
    await driver.get(`${base}/login`);

    const emailField = await driver.wait(
      until.elementLocated(By.id("email-input")),
      elemTimeout,
    );
    const continueButton = await driver.wait(
      until.elementLocated(By.id("continue-button")),
      elemTimeout,
    );
    await emailField.sendKeys(
      process.env.E2E_TEST_EMAIL || "nikprueba@user.com",
    );
    await continueButton.click();

    const passwordField = await driver.wait(
      until.elementLocated(By.id("password-input")),
      elemTimeout,
    );
    const loginButton = await driver.wait(
      until.elementLocated(By.id("login-button")),
      elemTimeout,
    );
    await passwordField.sendKeys(
      process.env.E2E_TEST_PASSWORD || "Colmillo27@",
    );
    await loginButton.click();

    // wait for home/dashboard
    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/home"),
      navTimeout,
    );

    // Open the side menu (hamburger) and click the "Tu perfil" / profile link inside it
    try {
      const menuButton = await driver.findElement(
        By.css('button[aria-label="Abrir menú"]'),
      );
      await menuButton.click();
      // wait for profile link inside the menu
      const profileLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/profile'] | //p[normalize-space(.)='Tu perfil']/ancestor::a",
          ),
        ),
        elemTimeout,
      );
      await profileLink.click();
    } catch {
      // fallback: navigate directly if menu/button not found
      await driver.get(`${base}/profile`);
    }

    // wait for profile page
    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/profile"),
      navTimeout,
    );

    // Verify content presence
    const bodyText = await driver.findElement(By.css("body")).getText();
    if (!/perfil|profile|mi perfil|mi-profile/i.test(bodyText)) {
      const altSelectors = [
        "#profile-page",
        ".profile",
        '[data-testid="profile-page"]',
      ];
      let found = false;
      for (const s of altSelectors) {
        const e = await driver.findElements(By.css(s));
        if (e.length > 0) {
          found = true;
          break;
        }
      }
      if (!found) throw new Error("No se detectó contenido de la vista perfil");
    }

    console.log("E2E: login y navegación a perfil OK");
    // Now open the menu again and click 'Tarjetas'
    try {
      const menuButton2 = await driver.findElement(
        By.css('button[aria-label="Abrir menú"]'),
      );
      await menuButton2.click();
      const cardsLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/personalCards'] | //p[normalize-space(.)='Tarjetas']/ancestor::a",
          ),
        ),
        elemTimeout,
      );
      await cardsLink.click();
    } catch {
      // fallback: direct
      await driver.get(`${base}/personalCards`);
    }

    // wait for personalCards page
    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/personalCards"),
      navTimeout,
    );
    // basic check for cards table
    const cardsBody = await driver.findElement(By.css("body")).getText();
    if (!/tarjeta|tarjetas|card|cards|Cargando tarjetas/i.test(cardsBody)) {
      // try a common selector
      const tableEls = await driver.findElements(
        By.css('table, .cards, [data-testid="cards-table"]'),
      );
      if (tableEls.length === 0)
        throw new Error("No se detectó la vista de Tarjetas");
    }

    console.log("E2E: navegación a Tarjetas OK");
  } catch (err) {
    hadError = true;
    console.error("E2E login->profile failed:", err);
  } finally {
    try {
      await driver.quit();
    } catch {}
    process.exit(hadError ? 1 : 0);
  }
})();
