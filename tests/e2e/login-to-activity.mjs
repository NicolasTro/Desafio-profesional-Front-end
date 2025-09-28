import { By, until } from "selenium-webdriver";
import { makeDriver, login, getBase } from "./_helpers.mjs";

(async function run() {
  let driver;
  let hadError = false;
  try {
    driver = await makeDriver();
    await login(driver);

    const base = getBase();
    // navigate to activity
    try {
      const menuBtn = await driver.findElement(By.css('button[aria-label="Abrir menú"]'));
      await menuBtn.click();
      const activityLink = await driver.wait(
        until.elementLocated(By.xpath("//a[@href='/activity'] | //p[normalize-space(.)='Actividad']/ancestor::a")),
        5000,
      );
      await activityLink.click();
    } catch {
      await driver.get(`${base}/activity`);
    }

    await driver.wait(async () => (await driver.getCurrentUrl()).includes("/activity"), 8000);

    const body = await driver.findElement(By.css("body")).getText();
    if (!/actividad|activity/i.test(body)) throw new Error("No se detectó la vista de Actividad");

    console.log("E2E: login->activity OK");
  } catch (err) {
    hadError = true;
    console.error("E2E login->activity failed:", err);
  } finally {
    try {
      if (driver) await driver.quit();
    } catch {}
    process.exit(hadError ? 1 : 0);
  }
})();
