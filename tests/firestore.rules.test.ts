import { strict as assert } from "node:assert";
import { after, before, describe, test } from "node:test";
import { readFileSync } from "node:fs";
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, serverTimestamp, setDoc, type Firestore } from "firebase/firestore";
import { createProfileSync } from "../lib/cloud-sync";
import { rewards } from "../lib/activities";
import { emptyData, mergeData, normaliseData, totalXP, withCompletion, withFields } from "../lib/progress";

describe("Firestore private profile rules",{skip:!process.env.FIRESTORE_EMULATOR_HOST},()=>{
  let env:RulesTestEnvironment;
  before(async()=>{env=await initializeTestEnvironment({projectId:"demo-speak-without-fear",firestore:{rules:readFileSync(new URL("../firestore.rules",import.meta.url),"utf8")}});});
  after(async()=>{await env?.cleanup();});
  const payload=(data=emptyData())=>({version:2,displayName:"Student",email:"student@example.test",updatedAt:serverTimestamp()});
  test("owners save and read their profile, while guests and other accounts are denied",async()=>{
    const alice=env.authenticatedContext("alice").firestore();const bob=env.authenticatedContext("bob").firestore();const guest=env.unauthenticatedContext().firestore();
    await assertSucceeds(setDoc(doc(alice,"profiles/alice"),payload()));await assertSucceeds(getDoc(doc(alice,"profiles/alice")));
    await assertFails(getDoc(doc(bob,"profiles/alice")));await assertFails(setDoc(doc(bob,"profiles/alice"),payload()));await assertFails(getDoc(doc(guest,"profiles/alice")));await assertFails(setDoc(doc(guest,"profiles/guest"),payload()));
  });
  test("all real profile fields and completion IDs fit within rules limits",async()=>{
    const db=env.authenticatedContext("full-profile").firestore();let data=withFields(emptyData(),{answers:Array(10).fill(2),before:3,after:8,note:"My private thought","wall-01":"First worry","wall-20":"Another worry",name:"Learner",goal:5});
    for(let i=1;i<=48;i++)data=withFields(data,{[`response-p${String(i).padStart(2,"0")}`]:"I enjoy learning new things with my friends every day."});
    for(const id of Object.keys(rewards))data=withCompletion(data,id);
    await assertSucceeds(setDoc(doc(db,"profiles/full-profile"),payload(data)));
    for(const [key,entry] of Object.entries(data.fields))await assertSucceeds(setDoc(doc(db,`profiles/full-profile/fields/${key}`),entry));
    for(const [id,time] of Object.entries(data.completions))await assertSucceeds(setDoc(doc(db,`profiles/full-profile/achievements/${id}`),{version:1,completedAt:time}));
  });
  test("achievements stay private and cannot be overwritten or awarded twice",async()=>{
    const alice=env.authenticatedContext("awards").firestore();const bob=env.authenticatedContext("not-awards").firestore();const ref=doc(alice,"profiles/awards/achievements/game-w01");
    await assertSucceeds(setDoc(ref,{version:1,completedAt:100}));await assertFails(setDoc(ref,{version:1,completedAt:200}));await assertFails(getDoc(doc(bob,"profiles/awards/achievements/game-w01")));await assertFails(setDoc(doc(bob,"profiles/awards/achievements/game-w02"),{version:1,completedAt:100}));
  });
  test("unknown fields, malformed ratings, and unregistered rewards are rejected",async()=>{
    const db=env.authenticatedContext("validation").firestore();const ref=doc(db,"profiles/validation");
    await assertFails(setDoc(ref,{...payload(),admin:true}));await assertFails(setDoc(doc(db,"profiles/validation/fields/before"),{value:99,at:1}));await assertFails(setDoc(doc(db,"profiles/validation/fields/unknown"),{value:"bad",at:1}));await assertFails(setDoc(doc(db,"profiles/validation/achievements/fake-xp"),{version:1,completedAt:100}));await assertFails(setDoc(doc(db,"profiles/validation/achievements/game-w01"),{version:1,completedAt:"not-a-date"}));
  });
  test("two device updates merge without losing independent achievements or granting duplicate XP",async()=>{
    const db=env.authenticatedContext("devices").firestore();const ref=doc(db,"profiles/devices");
    const a=withCompletion(withFields(emptyData(),{note:"From device A"},100),"game-w01",100);
    const b=withCompletion(withFields(emptyData(),{after:8},200),"game-s01",200);
    const syncA=createProfileSync(db as unknown as Firestore);const syncB=createProfileSync(db as unknown as Firestore);const identity={uid:"devices",displayName:"Learner",email:"learner@example.test"};
    await syncA(identity,a);const merged=await syncB(identity,b);const replay=await syncA(identity,a);
    const fresh=await createProfileSync(db as unknown as Firestore)(identity,emptyData());
    assert.equal(fresh.fields.note.value,"From device A");assert.equal(fresh.fields.after.value,8);assert.equal(totalXP(fresh),35);
    assert.equal(merged.fields.note.value,"From device A");assert.equal(merged.fields.after.value,8);assert.equal(totalXP(replay),15);
  });
});
