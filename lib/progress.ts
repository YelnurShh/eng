import { wallKeys } from "./wall";
import { rewards, speakingPrompts } from "./activities";

export type FieldValue = string | number | null | (number | null)[];
export type Field = { value: FieldValue; at: number };
export type LearningData = { fields: Record<string, Field>; completions: Record<string, number> };
export const emptyData = (): LearningData => ({ fields: {}, completions: {} });
export const GUEST_KEY = "swf-v2-guest";
export const userKey = (uid: string) => `swf-v2-user-${uid}`;
const promptFields = speakingPrompts.map(p=>`response-${p.id}`);
const allowedFields = ["answers", "before", "after", "note", "name", "goal", ...wallKeys, ...promptFields];

function validValue(key: string, value: unknown): value is FieldValue {
  if(key==="answers") return Array.isArray(value)&&value.length===10&&value.every(v=>v===null||Number.isInteger(v)&&v>=0&&v<=3);
  if(key==="before"||key==="after")return value===null||typeof value==="number"&&Number.isInteger(value)&&value>=0&&value<=10;
  if(key==="goal")return typeof value==="number"&&[3,5,10].includes(value);
  if(key==="note"||wallKeys.includes(key)||key==="name"||promptFields.includes(key))return typeof value==="string"&&value.length<=(key==="note"||wallKeys.includes(key)?140:key==="name"?60:3000);
  return false;
}
export function normaliseData(raw: unknown): LearningData {
  const result=emptyData(); if(!raw||typeof raw!=="object")return result;
  const source=raw as Partial<LearningData>;
  if(source.fields&&typeof source.fields==="object")for(const [key,field] of Object.entries(source.fields)){
    if(allowedFields.includes(key)&&field&&typeof field.at==="number"&&Number.isFinite(field.at)&&field.at>=0&&validValue(key,field.value))result.fields[key]={value:field.value,at:field.at};
  }
  if(source.completions&&typeof source.completions==="object")for(const [key,time] of Object.entries(source.completions)){
    if(Object.hasOwn(rewards,key)&&typeof time==="number"&&Number.isFinite(time)&&time>0)result.completions[key]=time;
  }
  return result;
}
// Field timestamps preserve edits; completion IDs form a set, so XP never duplicates.
export function mergeData(a: LearningData,b: LearningData): LearningData {
  const result=normaliseData(a); const other=normaliseData(b);
  for(const [key,field] of Object.entries(other.fields))if(!result.fields[key]||(field.at>result.fields[key].at||field.at===result.fields[key].at&&JSON.stringify(field.value)>JSON.stringify(result.fields[key].value)))result.fields[key]=field;
  for(const [key,time] of Object.entries(other.completions))result.completions[key]=Math.min(result.completions[key]??time,time);
  return result;
}
export function sameData(a:LearningData,b:LearningData){
  return Object.keys(a.fields).length===Object.keys(b.fields).length&&Object.keys(a.completions).length===Object.keys(b.completions).length
    &&Object.entries(a.fields).every(([key,f])=>f.at===b.fields[key]?.at&&JSON.stringify(f.value)===JSON.stringify(b.fields[key]?.value))
    &&Object.entries(a.completions).every(([key,time])=>b.completions[key]===time);
}
// Cloud awards are immutable. Acknowledged timestamps take precedence over an offline copy.
export function applyRemoteData(local:LearningData,remote:LearningData){
  const merged=mergeData(local,remote);merged.completions={...merged.completions,...remote.completions};return merged;
}
export function withFields(data: LearningData, values: Record<string, FieldValue>, now=Date.now()): LearningData {
  const fields={...data.fields};for(const [key,value] of Object.entries(values))if(validValue(key,value))fields[key]={value,at:Math.max(now,(fields[key]?.at??0)+1)};
  return {...data,fields};
}
export function withCompletion(data: LearningData,id: string,now=Date.now()): LearningData {
  if(!Object.hasOwn(rewards,id)||data.completions[id])return data;
  return {...data,completions:{...data.completions,[id]:now}};
}
export function totalXP(data: LearningData){return Object.keys(data.completions).reduce((sum,id)=>sum+(rewards[id]??0),0);}
export function localDay(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;}
export function dailyCounts(data: LearningData){const counts:Record<string,number>={};Object.entries(data.completions).filter(([id])=>rewards[id]>0).forEach(([,time])=>{const key=localDay(new Date(time));counts[key]=(counts[key]??0)+1;});return counts;}
export function streakDays(data: LearningData,today=new Date()){
  const days=dailyCounts(data);const cursor=new Date(today);if(!days[localDay(cursor)])cursor.setDate(cursor.getDate()-1);
  let streak=0;while(days[localDay(cursor)]){streak++;cursor.setDate(cursor.getDate()-1);}return streak;
}
export function migrateLegacy(raw: unknown): LearningData {
  if(!raw||typeof raw!=="object")return emptyData();const old=raw as Record<string,unknown>;
  let data=withFields(emptyData(),{answers:old.answers as FieldValue,before:old.before as FieldValue,after:old.after as FieldValue,note:old.note as FieldValue});
  if(Array.isArray(old.completed))old.completed.filter(d=>Number.isInteger(d)&&d>=1&&d<=7).forEach(d=>{data=withCompletion(data,`challenge-${d}`);});
  return data;
}
export function hasEnglishResponse(text:string){const words=text.match(/[a-z]+(?:'[a-z]+)?/gi)??[];return words.length>=8&&new Set(words.map(w=>w.toLowerCase())).size>2;}
