import { strict as assert } from "node:assert";
import { test } from "node:test";
import { activities, challengePrograms, rewards, shuffle } from "../lib/activities";
import { applyRemoteData, dailyCounts, emptyData, hasEnglishResponse, localDay, mergeData, migrateLegacy, normaliseData, streakDays, totalXP, userKey, withCompletion, withFields } from "../lib/progress";

test("a completed activity grants XP once, including after cloud merge and replay",()=>{
  const once=withCompletion(emptyData(),"game-w01",1000);const replay=withCompletion(once,"game-w01",2000);
  assert.equal(totalXP(replay),15);assert.equal(replay.completions["game-w01"],1000);
  assert.equal(totalXP(mergeData(once,replay)),15);assert.strictEqual(replay,once);
  assert.equal(totalXP(withCompletion(once,"unknown-game",3000)),15);
});
test("cloud and local merges retain the latest fields and union independent achievements",()=>{
  const a=withCompletion(withFields(emptyData(),{note:"Earlier",before:3},100),"game-w01",100);
  const b=withCompletion(withFields(emptyData(),{note:"Later",after:8},200),"game-s01",200);
  const merged=mergeData(a,b);assert.equal(merged.fields.note.value,"Later");assert.equal(merged.fields.before.value,3);assert.equal(merged.fields.after.value,8);assert.equal(totalXP(merged),35);
  assert.deepEqual(mergeData(a,b),mergeData(b,a));assert.deepEqual(mergeData(merged,merged),merged);
});
test("simultaneous timestamp conflicts converge deterministically",()=>{
  const a=withFields(emptyData(),{note:"A"},100);const b=withFields(emptyData(),{note:"B"},100);
  assert.deepEqual(mergeData(a,b),mergeData(b,a));assert.equal(mergeData(a,b).fields.note.value,"B");
});
test("malformed local or remote data cannot produce fake activity IDs or invalid ratings",()=>{
  const raw={fields:{before:{value:11,at:1},answers:{value:[null],at:2},note:{value:"ok",at:3},unknown:{value:"ignored",at:1}},completions:{"game-w01":100,"game-w02":"invalid",toString:1,"fake":10000}};
  const clean=normaliseData(raw);assert.deepEqual(Object.keys(clean.fields),["note"]);assert.deepEqual(clean.completions,{"game-w01":100});assert.equal(totalXP(clean),15);
});
test("a cleared reflection remains cleared when old cloud data is merged",()=>{
  const old=withFields(emptyData(),{note:"private thought"},100);const cleared=withFields(old,{note:""},200);assert.equal(mergeData(cleared,old).fields.note.value,"");
});
test("partial challenge rounds persist but do not inflate XP or the daily goal",()=>{
  const date=new Date(2026,9,21,12);let data=emptyData();for(let i=0;i<3;i++)data=withCompletion(data,`challenge-1-round-${i}`,date.getTime());
  assert.equal(totalXP(data),0);assert.deepEqual(dailyCounts(data),{});data=withCompletion(data,"challenge-1",date.getTime());assert.equal(totalXP(data),40);assert.equal(dailyCounts(data)[localDay(date)],1);
});
test("streaks use local calendar days and tolerate today not yet being complete",()=>{
  const today=new Date(2026,9,21,12);const yesterday=new Date(2026,9,20,12);const previous=new Date(2026,9,19,12);
  let data=withCompletion(emptyData(),"game-w01",yesterday.getTime());data=withCompletion(data,"game-w02",previous.getTime());assert.equal(streakDays(data,today),2);
  data=withCompletion(data,"game-w03",today.getTime());assert.equal(streakDays(data,today),3);assert.equal(streakDays(data,new Date(2026,9,23,12)),0);
});
test("legacy progress migrates without accepting out-of-range challenge days",()=>{
  const migrated=migrateLegacy({answers:Array(10).fill(2),completed:[1,2,9,-1],before:4,after:7,note:"Hello"});assert.equal(migrated.fields.note.value,"Hello");assert.deepEqual(Object.keys(migrated.completions),["challenge-1","challenge-2"]);assert.notEqual(userKey("alice"),userKey("bob"));
});
test("English response completion needs meaningful length and distinct words",()=>{
  assert.equal(hasEnglishResponse("hello hello hello hello hello hello hello hello"),false);assert.equal(hasEnglishResponse("бір екі үш төрт бес алты жеті сегіз"),false);assert.equal(hasEnglishResponse("I like reading books and learning new things every day."),true);
});
test("every challenge and game maps to a real answer and a registered reward",()=>{
  const ids=new Set(activities.map(a=>a.id));assert.equal(ids.size,activities.length);
  for(const activity of activities){assert.ok(activity.kind==="sentence"?activity.choices.join(" ")===activity.answer:activity.choices.includes(activity.answer));assert.equal(rewards[`game-${activity.id}`],activity.xp);assert.equal(shuffle(activity.choices,123).length,activity.choices.length);}
  for(const program of challengePrograms)for(const id of program)assert.ok(ids.has(id));
});

test("acknowledged cloud awards keep canonical timestamps without dropping pending local wins",()=>{
  const local=withCompletion(withCompletion(emptyData(),"game-w01",100),"game-w02",200);const remote=withCompletion(emptyData(),"game-w01",150);const result=applyRemoteData(local,remote);assert.equal(result.completions["game-w01"],150);assert.equal(result.completions["game-w02"],200);assert.equal(totalXP(result),30);
});

test("wall notes remain independent, preserve legacy text, and do not return after deletion",async()=>{
  const {wallNotes,freeWallKey}=await import("../lib/wall");
  let data=withFields(emptyData(),{note:"Legacy worry","wall-01":"First worry","wall-02":"Second worry"},100);
  assert.equal(wallNotes(data).length,3);
  assert.equal(freeWallKey(data),"wall-03");
  const stale=data;data=withFields(data,{"wall-01":""},200);
  const merged=mergeData(stale,data);
  assert.equal(wallNotes(merged).length,2);
  assert.ok(wallNotes(merged).some(note=>note.text==="Second worry"));
  assert.equal(freeWallKey(merged),"wall-01");
  assert.equal(withFields(data,{"wall-21":"invalid"}).fields["wall-21"],undefined);
  assert.equal(withFields(data,{"wall-03":"x".repeat(141)}).fields["wall-03"],undefined);
});
test("all twelve speaking topics have four distinct prompts and persist responses",async()=>{
  const {speakingPrompts}=await import("../lib/activities");
  const {content,locales,isSection}=await import("../lib/i18n");
  assert.equal(speakingPrompts.length,48);
  assert.equal(new Set(speakingPrompts.map(p=>p.id)).size,48);
  assert.equal(isSection("research"),false);
  for(const locale of locales){assert.equal(content[locale].speaking.topics.length,12);}
  for(let topic=0;topic<12;topic++)assert.equal(speakingPrompts.filter(p=>p.topic===topic).length,4);
  for(const prompt of speakingPrompts){const key=`response-${prompt.id}`;const data=withFields(emptyData(),{[key]:"I would like to practise speaking about this topic today."});assert.ok(normaliseData(data).fields[key]);assert.equal(rewards[`speak-${prompt.id}`],25);}
});
