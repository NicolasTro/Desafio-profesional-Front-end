import { Builder, By, until } from "selenium-webdriver";
import edge from "selenium-webdriver/edge.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export async function makeDriver() {
  const edgeDriverPath = process.env.EDGE_DRIVER_PATH;
  if (!edgeDriverPath) throw new Error("EDGE_DRIVER_PATH not set");
  const service = new edge.ServiceBuilder(edgeDriverPath);
  return new Builder().forBrowser("MicrosoftEdge").setEdgeService(service).build();
}

export async function login(driver, opts = {}) {
  const base = process.env.E2E_BASE_URL || "http://localhost:3000";
  const email = opts.email || process.env.E2E_TEST_EMAIL || "nikprueba@user.com";
  const password = opts.password || process.env.E2E_TEST_PASSWORD || "Colmillo27@";
  const elemTimeout = Number(process.env.E2E_ELEMENT_TIMEOUT_MS || 7000);

  await driver.get(`${base}/login`);

  const emailField = await driver.wait(until.elementLocated(By.id("email-input")), elemTimeout);
  const continueButton = await driver.wait(until.elementLocated(By.id("continue-button")), elemTimeout);
  await emailField.sendKeys(email);
  await continueButton.click();

  const passwordField = await driver.wait(until.elementLocated(By.id("password-input")), elemTimeout);
  const loginButton = await driver.wait(until.elementLocated(By.id("login-button")), elemTimeout);
  await passwordField.sendKeys(password);
  await loginButton.click();

  // Wait for a stable logged-in route (home/dashboard)
  const navTimeout = Number(process.env.E2E_NAV_TIMEOUT_MS || 10000);
  await driver.wait(async () => (await driver.getCurrentUrl()).includes("/home"), navTimeout);
}

export function getBase() {
  return process.env.E2E_BASE_URL || "http://localhost:3000";
}
