import { collection, doc, getDocs, runTransaction, serverTimestamp, type Firestore } from "firebase/firestore";
import { mergeData, normaliseData, type LearningData } from "./progress";

type Identity={uid:string;displayName:string|null;email:string|null};
// Individual records keep rules small and let writes update only the fields that changed.
export function createProfileSync(db:Firestore){
  const cache=new Map<string,{at:number;data:LearningData}>();
  return async(user:Identity,local:LearningData)=>{
    let cached=cache.get(user.uid);
    if(!cached||Date.now()-cached.at>30000){
      const [fields,awards]=await Promise.all([getDocs(collection(db,"profiles",user.uid,"fields")),getDocs(collection(db,"profiles",user.uid,"achievements"))]);
      cached={at:Date.now(),data:normaliseData({fields:Object.fromEntries(fields.docs.map(item=>[item.id,item.data()])),completions:Object.fromEntries(awards.docs.map(item=>[item.id,item.data().completedAt]))})};cache.set(user.uid,cached);
    }
    const stored=cached.data;
    const changed=Object.keys(local.fields).filter(key=>{const field=stored.fields[key];return !field||field.at!==local.fields[key].at||JSON.stringify(field.value)!==JSON.stringify(local.fields[key].value);});
    const missing=Object.keys(local.completions).filter(id=>!stored.completions[id]);
    const merged=await runTransaction(db,async transaction=>{
      const [fieldSnapshots,awardSnapshots]=await Promise.all([
        Promise.all(changed.map(key=>transaction.get(doc(db,"profiles",user.uid,"fields",key)))),
        Promise.all(missing.map(id=>transaction.get(doc(db,"profiles",user.uid,"achievements",id))))
      ]);
      const confirmed=normaliseData(stored);
      fieldSnapshots.forEach(snapshot=>{if(snapshot.exists())confirmed.fields[snapshot.id]=snapshot.data() as LearningData["fields"][string];});
      awardSnapshots.forEach(snapshot=>{if(snapshot.exists())confirmed.completions[snapshot.id]=snapshot.data().completedAt;});
      const next=mergeData(confirmed,local);next.completions={...next.completions,...confirmed.completions};
      transaction.set(doc(db,"profiles",user.uid),{version:2,displayName:(user.displayName??"").slice(0,100),email:(user.email??"").slice(0,320),updatedAt:serverTimestamp()});
      fieldSnapshots.forEach(snapshot=>transaction.set(snapshot.ref,next.fields[snapshot.id]));
      awardSnapshots.forEach(snapshot=>{if(!snapshot.exists())transaction.set(snapshot.ref,{completedAt:next.completions[snapshot.id],version:1});});
      return next;
    });cache.set(user.uid,{at:cached.at,data:merged});return merged;
  };
}
