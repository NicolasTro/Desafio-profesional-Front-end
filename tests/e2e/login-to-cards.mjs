import { By, until } from "selenium-webdriver";
import { makeDriver, login, getBase } from "./_helpers.mjs";

(async function run() {
  let driver;
  let hadError = false;
  try {
    driver = await makeDriver();
    await login(driver);

    const base = getBase();
    // navigate to personalCards
    try {
      const menuBtn = await driver.findElement(By.css('button[aria-label="Abrir menú"]'));
      await menuBtn.click();
      const cardsLink = await driver.wait(
        until.elementLocated(By.xpath("//a[@href='/personalCards'] | //p[normalize-space(.)='Tarjetas']/ancestor::a")),
        5000,
      );
      await cardsLink.click();
    } catch {
      await driver.get(`${base}/personalCards`);
    }

    await driver.wait(async () => (await driver.getCurrentUrl()).includes("/personalCards"), 8000);

    const body = await driver.findElement(By.css("body")).getText();
    if (!/tarjeta|tarjetas|cards|card/i.test(body)) throw new Error("No se detectó la vista de Tarjetas");

    console.log("E2E: login->personalCards OK");
  } catch (err) {
    hadError = true;
    console.error("E2E login->personalCards failed:", err);
  } finally {
    try {
      if (driver) await driver.quit();
    } catch {}
    process.exit(hadError ? 1 : 0);
  }
})();
