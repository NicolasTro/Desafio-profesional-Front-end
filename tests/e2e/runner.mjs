import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const e2eDir = path.resolve(process.cwd(), "tests", "e2e");
const runnerName = path.basename(new URL(import.meta.url).pathname);
const tests = fs.existsSync(e2eDir)
  ? fs
      .readdirSync(e2eDir)
      .filter((f) => f.endsWith(".mjs") && f !== runnerName)
      .map((f) => path.resolve(e2eDir, f))
  : [];

function runTest(file) {
  return new Promise((resolve, reject) => {
  const timeoutMs = Number(process.env.E2E_TEST_TIMEOUT_MS || 120000); // default 2 minutes
  // pass current env to child so it can access EDGE_DRIVER_PATH, E2E_BASE_URL, etc.
    const p = spawn(process.execPath, [file], {
      stdio: "inherit",
      env: process.env
    });
    const timer = setTimeout(() => {
      try {
        p.kill("SIGKILL");
      } catch {}
      reject(new Error(`${file} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const onFinish = (code, signal) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else
        reject(
          new Error(
            `${file} exited with code ${code}${
              signal ? " signal:" + signal : ""
            }`
          )
        );
    };

    p.on("close", onFinish);
    p.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    // ensure child is killed on parent SIGINT
    const onSig = () => {
      try {
        p.kill("SIGTERM");
      } catch {}
      process.exit(130);
    };
    process.once("SIGINT", onSig);
  });
}

(async () => {
  try {
    if (tests.length === 0) {
      console.warn("No E2E tests found in", e2eDir);
      process.exit(0);
    }
    for (const t of tests) {
      console.log("\n===== Running e2e:", t, "=====\n");
      await runTest(t);
    }
    console.log("\nAll E2E tests passed");
    process.exit(0);
  } catch (err) {
    console.error("\nE2E runner failed:", err);
    process.exit(2);
  }
})();
