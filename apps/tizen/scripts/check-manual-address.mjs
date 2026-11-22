// Check the real build output without replacing a developer's dist/ folder.
import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { buildTizen } from "./build.mjs";

const temp = mkdtempSync(join(tmpdir(), "pley-tizen-check-"));
try {
  for (const manual of [false, true]) {
    if (manual) process.env.PLEY_TIZEN_MANUAL_ADDRESS_ONLY = "1";
    else delete process.env.PLEY_TIZEN_MANUAL_ADDRESS_ONLY;
    const out = join(temp, manual ? "manual" : "default");
    await buildTizen(out);
    const html = readFileSync(join(out, "index.html"), "utf8");
    const { window } = new JSDOM(html);
    try {
      assert.equal(window.document.querySelector('meta[name="pley-manual-address-only"]') !== null, manual);
    } finally {
      window.close();
    }
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log("Samsung build output: only the manual-address-only build contains the opt-in marker.");
