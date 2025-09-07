import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const e2eDir = path.resolve(process.cwd(), 'tests', 'e2e');
const runnerName = path.basename(new URL(import.meta.url).pathname);
const tests = fs.readdirSync(e2eDir)
  .filter((f) => f.endsWith('.mjs') && f !== runnerName)
  .map((f) => path.resolve(e2eDir, f));

function runTest(file) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [file], { stdio: 'inherit' });
    // kill the child if it runs longer than timeout
    const timeoutMs = Number(process.env.E2E_TEST_TIMEOUT_MS || 120000); // default 2 minutes
    const timer = setTimeout(() => {
      try { p.kill('SIGKILL'); } catch (e) {}
      reject(new Error(`${file} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    p.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`${file} exited with code ${code}`));
    });
    p.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

(async () => {
  try {
    for (const t of tests) {
      console.log('\n===== Running e2e:', t, '=====\n');
      await runTest(t);
    }
    console.log('\nAll E2E tests passed');
    process.exit(0);
  } catch (err) {
    console.error('\nE2E runner failed:', err);
    process.exit(2);
  }
})();
