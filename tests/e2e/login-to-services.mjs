import { By, until } from "selenium-webdriver";
import { makeDriver, login, getBase } from "./_helpers.mjs";

(async function run() {
  let driver;
  let hadError = false;
  try {
    driver = await makeDriver();
    await login(driver);

    const base = getBase();
    // Attempt to navigate to services: try menu, then direct URL
    try {
      const menuBtn = await driver.findElement(By.css('button[aria-label="Abrir menú"]'));
      await menuBtn.click();
      const servicesLink = await driver.wait(
        until.elementLocated(By.xpath("//a[@href='/services'] | //p[normalize-space(.)='Servicios']/ancestor::a")),
        5000,
      );
      await servicesLink.click();
    } catch {
      await driver.get(`${base}/services`);
    }

    // wait for services URL
    await driver.wait(async () => (await driver.getCurrentUrl()).includes("/services"), 8000);

    // Basic content check
    const body = await driver.findElement(By.css("body")).getText();
    if (!/servicios|services/i.test(body)) throw new Error("No se detectó la vista de Servicios");

    console.log("E2E: login->services OK");
  } catch (err) {
    hadError = true;
    console.error("E2E login->services failed:", err);
  } finally {
    try {
      if (driver) await driver.quit();
    } catch {}
    process.exit(hadError ? 1 : 0);
  }
})();
