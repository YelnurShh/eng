import test from "node:test";
import assert from "node:assert/strict";
import { awardForUser, sessionData, safeReturnPath, authHref } from "../lib/auth-policy";
import { emptyData, totalXP, withCompletion, withFields } from "../lib/progress";

test("guests cannot receive any completion, including partial challenge steps",()=>{
  const data=withFields(emptyData(),{before:5});
  for(const id of ["first-word","fear-test","challenge-1-round-0","challenge-1"]){
    assert.equal(awardForUser(data,id,null,1000),data);
    assert.equal(totalXP(awardForUser(data,id,undefined,1000)),0);
  }
});
test("authenticated completion awards are idempotent",()=>{
  const first=awardForUser(emptyData(),"first-word","student-a",1000);
  assert.equal(totalXP(first),20);
  assert.deepEqual(awardForUser(first,"first-word","student-a",2000),first);
});
test("guest sessions ignore saved awards and account sessions start with only their own cache",()=>{
  const guest=withCompletion(emptyData(),"first-word",1000);
  assert.deepEqual(sessionData(null,guest),emptyData());
  assert.deepEqual(sessionData("student-a"),emptyData());
  assert.deepEqual(sessionData("student-a",guest),guest);
});
test("return destinations stay on valid learning pages and use the selected language",()=>{
  for(const value of ["https://evil.example","//evil.example","/\\evil.example","/kk/login","/kk/register","/kk/reset-password","/kk/unknown","/kk/games/extra","/%2f%2fevil.example"]){
    assert.equal(safeReturnPath(value,"kk"),"/kk/profile");
  }
  assert.equal(safeReturnPath("/en/games?daily=1#play","kk"),"/kk/games?daily=1#play");
  assert.equal(safeReturnPath("/ru","en"),"/en");
  assert.equal(authHref("kk","register","/kk/games"),"/kk/register?next=%2Fkk%2Fgames");
});
