import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { acquireDevLock } from "./dev-lock.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const portIndex = args.findIndex(value => value === "--port" || value === "-p");
const inlinePort = args.find(value => value.startsWith("--port="))?.split("=")[1];
const port = inlinePort || (portIndex >= 0 ? args[portIndex + 1] : process.env.PORT) || "3000";
const lock = acquireDevLock(fileURLToPath(new URL("../.dev-server.lock", import.meta.url)), port);

if (!lock.acquired) {
  console.log(`Dev server is already running or starting at http://localhost:${lock.port || port}. Reuse it instead of opening a second server.`);
  process.exit(0);
}
process.on("exit", () => lock.release());
// Only the lock owner cleans this generated cache. A second npm run dev cannot touch it.
rmSync(fileURLToPath(new URL("../.next-dev", import.meta.url)), { recursive: true, force: true });
const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");
if (portIndex < 0 && !inlinePort) args.push("--port", port);
const child = spawn(process.execPath, [nextCli, "dev", ...args], { cwd: root, stdio: "inherit", env: process.env });
lock.setChild(child.pid);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { if (!child.killed) child.kill(signal); });
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
child.on("exit", (code, signal) => { lock.release(); process.exit(code ?? (signal === "SIGINT" || signal === "SIGTERM" ? 0 : 1)); });
