import { closeSync, openSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";

function alive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; }
  catch (error) { return error.code === "EPERM"; }
}

export function acquireDevLock(path, port) {
  const owner = { pid: process.pid, childPid: null, port, startedAt: Date.now() };
  for (let attempt = 0; attempt < 3; attempt++) {
    let descriptor;
    try { descriptor = openSync(path, "wx"); }
    catch (error) {
      if (error.code !== "EEXIST") throw error;
      let raw, previous;
      try { raw = readFileSync(path, "utf8"); previous = JSON.parse(raw); }
      catch {
        try { if (Date.now() - statSync(path).mtimeMs < 30000) return { acquired: false, port }; }
        catch (error) { if (error.code === "ENOENT") continue; throw error; }
      }
      if (previous && (alive(previous.pid) || alive(previous.childPid))) return { acquired: false, port: previous.port, pid: previous.pid };
      try { if (readFileSync(path, "utf8") === raw) unlinkSync(path); }
      catch (error) { if (error.code !== "ENOENT") throw error; }
      continue;
    }
    writeFileSync(descriptor, JSON.stringify(owner)); closeSync(descriptor);
    const owned = () => {
      try { return JSON.parse(readFileSync(path, "utf8")).pid === owner.pid; }
      catch { return false; }
    };
    return {
      acquired: true,
      setChild(pid) { owner.childPid = pid; if (owned()) writeFileSync(path, JSON.stringify(owner)); },
      release() { if (owned()) { try { unlinkSync(path); } catch (error) { if (error.code !== "ENOENT") throw error; } } },
    };
  }
  throw new Error("Could not acquire the development server lock. Try again shortly.");
}
