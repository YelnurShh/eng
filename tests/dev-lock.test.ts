import { strict as assert } from "node:assert";
import { test } from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// The launcher module uses native Node filesystem and PID checks, without starting Next.js.
import { acquireDevLock } from "../scripts/dev-lock.mjs";

test("a second dev invocation cannot own or clear the first server's cache",()=>{
  const dir=mkdtempSync(join(tmpdir(),"swf-dev-lock-"));const path=join(dir,"lock");
  try{const first=acquireDevLock(path,"3000");assert.equal(first.acquired,true);const second=acquireDevLock(path,"3001");assert.equal(second.acquired,false);assert.equal(second.port,"3000");assert.equal(JSON.parse(readFileSync(path,"utf8")).pid,process.pid);first.release?.();assert.equal(acquireDevLock(path,"3001").acquired,true);}finally{rmSync(dir,{recursive:true,force:true});}
});
test("a stale server lock can be recovered after a crash",()=>{
  const dir=mkdtempSync(join(tmpdir(),"swf-dev-lock-"));const path=join(dir,"lock");
  try{writeFileSync(path,JSON.stringify({pid:2147483647,childPid:2147483647,port:"3000"}));const recovered=acquireDevLock(path,"3000");assert.equal(recovered.acquired,true);recovered.release?.();}finally{rmSync(dir,{recursive:true,force:true});}
});
test("a briefly empty lock during startup is respected rather than removed",()=>{
  const dir=mkdtempSync(join(tmpdir(),"swf-dev-lock-"));const path=join(dir,"lock");
  try{writeFileSync(path,"");assert.equal(acquireDevLock(path,"3000").acquired,false);assert.equal(readFileSync(path,"utf8"),"");}finally{rmSync(dir,{recursive:true,force:true});}
});
