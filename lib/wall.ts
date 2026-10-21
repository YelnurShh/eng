import type { LearningData } from "./progress";
export const wallKeys=Array.from({length:20},(_,i)=>`wall-${String(i+1).padStart(2,"0")}`);
export function wallNotes(data:LearningData){
  const notes=wallKeys.flatMap((key,i)=>{const entry=data.fields[key];return typeof entry?.value==="string"&&entry.value.trim()?[{key,text:entry.value,at:entry.at,slot:i}]:[];});
  const legacy=data.fields.note;
  if(typeof legacy?.value==="string"&&legacy.value.trim())notes.push({key:"note",text:legacy.value,at:legacy.at,slot:20});
  return notes.sort((a,b)=>b.at-a.at||a.key.localeCompare(b.key));
}
export const freeWallKey=(data:LearningData)=>wallKeys.find(key=>!data.fields[key]?.value);
