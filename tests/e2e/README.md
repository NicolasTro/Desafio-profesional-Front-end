E2E tests (Selenium)
=====================

Quick guide to run the E2E tests under `tests/e2e/`.

Prerequisites
-------------

- Node.js >= 18 (so ESM *.mjs runs with node)
- Microsoft Edge WebDriver (msedgedriver) matching the installed Edge version
- Set the environment variable `EDGE_DRIVER_PATH` pointing to the `msedgedriver` executable
- Create a `.env.local` file in the repository root (or set env vars) with at least:

  EDGE_DRIVER_PATH=C:\path\to\msedgedriver.exe
  E2E_BASE_URL=http://localhost:3000

Running
-------

There's a simple runner at `tests/e2e/runner.mjs` that will execute all `.mjs` tests in the folder.

From the repo root:

```bash
# install deps if needed
npm install selenium-webdriver

# run the runner (it will run every .mjs test in tests/e2e/)
node tests/e2e/runner.mjs
```

Notes and tips
--------------

- The tests use ESM modules (.mjs). If you prefer to use Chrome, update the scripts to use `selenium-webdriver/chrome.js` and set CHROME_DRIVER_PATH accordingly.
- Timeouts are configurable via environment variables: `E2E_ELEMENT_TIMEOUT_MS`, `E2E_NAV_TIMEOUT_MS`, `E2E_TEST_TIMEOUT_MS`.
- After running tests, update `tests_executions.csv` with actual results if you want a record.
