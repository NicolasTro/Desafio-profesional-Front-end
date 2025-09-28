import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import edge from "selenium-webdriver/edge.js";

dotenv.config({ path: ".env.local" });

(async function loginFailureTest() {
  const edgeDriverPath = process.env.EDGE_DRIVER_PATH;
  if (!edgeDriverPath) {
    console.error("Error: La variable de entorno EDGE_DRIVER_PATH no está configurada.");
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
    const elemTimeout = Number(process.env.E2E_ELEMENT_TIMEOUT_MS || 7000);

    await driver.get(`${base}/login`);

    // Attempt login with invalid credentials and expect an error message
    const emailField = await driver.wait(
      until.elementLocated(By.id("email-input")),
      elemTimeout,
    );
    const continueButton = await driver.wait(
      until.elementLocated(By.id("continue-button")),
      elemTimeout,
    );
    await emailField.sendKeys("invalid@example.com");
    await continueButton.click();

    const passwordField = await driver.wait(
      until.elementLocated(By.id("password-input")),
      elemTimeout,
    );
    const loginButton = await driver.wait(
      until.elementLocated(By.id("login-button")),
      elemTimeout,
    );
    await passwordField.sendKeys("wrong-password");
    await loginButton.click();

    // Wait for an error indication (toast, inline, aria-live, etc.)
    const errSelectors = [
      '.error, .error-message, [role="alert"], [data-testid="login-error"]',
    ];
    let foundError = false;
    for (const s of errSelectors) {
      const els = await driver.findElements(By.css(s));
      if (els.length > 0) {
        foundError = true;
        break;
      }
    }

    // As an alternative, look for textual clues in the body
    if (!foundError) {
      const bodyText = await driver.findElement(By.css("body")).getText();
      if (/contraseña|password|credenciales|invalid|incorrect/i.test(bodyText)) {
        foundError = true;
      }
    }

    if (!foundError) throw new Error("No se detectó mensaje de error tras credenciales inválidas");

    console.log("E2E: login-failure behavior OK");
  } catch (err) {
    hadError = true;
    console.error("E2E login-failure test failed:", err);
  } finally {
    try {
      await driver.quit();
    } catch {}
    process.exit(hadError ? 1 : 0);
  }
})();
