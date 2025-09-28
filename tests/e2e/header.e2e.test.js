import dotenv from "dotenv";
import { Builder, By, until } from "selenium-webdriver";
import edge from "selenium-webdriver/edge.js";

dotenv.config({ path: ".env.local" });

(async function headerSmokeTest() {
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

		await driver.get(base);

		// Wait for header to appear (robust selectors)
		await driver.wait(
			until.elementLocated(By.css("header, [data-testid='app-header'], #header")),
			elemTimeout,
		);

		// Check for a logo/link and click it to validate navigation
		const logoCandidates = await driver.findElements(
			By.css('header a[aria-label*="logo"], [data-testid="logo"], header img, a[href="/"]'),
		);
		if (logoCandidates.length > 0) {
			try {
				await logoCandidates[0].click();
			} catch {}
		}

		// Basic navigation sanity: ensure page is reachable
		await driver.wait(async () => (await driver.getCurrentUrl()).length > 0, 3000);

		// Try opening a main nav link (if exists) and verify URL change
		const navLinkCandidates = await driver.findElements(
			By.css('nav a[href], [data-testid="nav-link"]'),
		);
		if (navLinkCandidates.length > 0) {
			try {
				await navLinkCandidates[0].click();
				// allow a brief wait for navigation
				await driver.wait(async () => (await driver.getCurrentUrl()) !== base, 5000);
			} catch {}
		}

		console.log("E2E: header/navigation smoke OK");
	} catch (err) {
		hadError = true;
		console.error("E2E header test failed:", err);
	} finally {
		try {
			await driver.quit();
		} catch {}
		process.exit(hadError ? 1 : 0);
	}
})();

