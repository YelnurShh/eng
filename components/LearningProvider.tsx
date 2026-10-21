"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import type { FirebaseServices } from "@/lib/firebase";
import { firebaseConfigured } from "@/lib/firebase-config";
import { applyRemoteData, emptyData, normaliseData, sameData, userKey, withFields, type FieldValue, type LearningData } from "@/lib/progress";
import { awardForUser, sessionData } from "@/lib/auth-policy";
import { rewards } from "@/lib/activities";

type SyncStatus="loading"|"local"|"saving"|"saved"|"error";
type LearningContextValue={data:LearningData;ready:boolean;user:User|null;configured:boolean;authBusy:boolean;authError:string;sync:SyncStatus;storageAvailable:boolean;setFields:(values:Record<string,FieldValue>)=>void;complete:(id:string)=>number;login:()=>Promise<boolean>;emailLogin:(email:string,password:string)=>Promise<boolean>;register:(email:string,password:string)=>Promise<boolean>;resetPassword:(email:string)=>Promise<boolean>;clearAuthError:()=>void;logout:()=>Promise<void>;retry:()=>void};
const LearningContext=createContext<LearningContextValue|null>(null);

function load(key:string){try{return normaliseData(JSON.parse(localStorage.getItem(key)??"null"));}catch{return emptyData();}}
function persist(key:string,data:LearningData){try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{return false;}}
function errorCode(error:unknown){return error&&typeof error==="object"&&"code" in error?String(error.code):"unknown";}

export default function LearningProvider({children}:{children:React.ReactNode}){
  const [data,setData]=useState<LearningData>(emptyData);
  const [user,setUser]=useState<User|null>(null);
  const [ready,setReady]=useState(false);
  const [authBusy,setAuthBusy]=useState(false);
  const [authError,setAuthError]=useState("");
  const [sync,setSync]=useState<SyncStatus>("loading");
  const [storageAvailable,setStorageAvailable]=useState(true);
  const [revision,setRevision]=useState(0);
  const dataRef=useRef(data);const userRef=useRef<User|null>(null);const services=useRef<FirebaseServices|null>(null);
  const accountVersion=useRef(0);const chain=useRef<Promise<unknown>>(Promise.resolve());

  const publish=useCallback((next:LearningData)=>{
    dataRef.current=next;setData(next);if(userRef.current)setStorageAvailable(persist(userKey(userRef.current.uid),next));
  },[]);
  const syncNow=useCallback(()=>{
    const current=userRef.current;const api=services.current;if(!current||!api)return Promise.resolve();
    const version=accountVersion.current;const snapshot=dataRef.current;setSync("saving");
    const task=chain.current.catch(()=>{}).then(async()=>{
      if(accountVersion.current!==version)return;
      try{
        const remote=await api.sync(current,snapshot);
        if(accountVersion.current!==version)return;
        const merged=applyRemoteData(dataRef.current,remote);const pending=!sameData(merged,remote);publish(merged);
        setSync(pending?"saving":"saved");if(pending)setRevision(r=>r+1);
      }catch{if(accountVersion.current===version)setSync("error");}
    });chain.current=task;return task;
  },[publish]);

  useEffect(()=>{
    let active=true;let unsubscribe:(()=>void)|undefined;
    publish(sessionData(null));
    if(!firebaseConfigured){setReady(true);setSync("local");return()=>{active=false;};}
    import("@/lib/firebase").then(({firebaseServices})=>{
      if(!active)return;const api=firebaseServices();services.current=api;
      unsubscribe=api.watch(current=>{
        if(!active)return;accountVersion.current++;userRef.current=current;setUser(current);setAuthBusy(false);setAuthError("");
        if(current){publish(sessionData(current.uid,load(userKey(current.uid))));setReady(true);void syncNow();}
        else{publish(sessionData(null));setReady(true);setSync("local");}
      },()=>{if(active){setReady(true);setSync("error");setAuthError("unknown");}});
    }).catch(()=>{if(active){setReady(true);setSync("error");setAuthError("unknown");}});
    return()=>{active=false;unsubscribe?.();accountVersion.current++;};
  },[publish,syncNow]);

  useEffect(()=>{
    if(!revision)return;if(!user){setSync("local");return;}
    const timeout=setTimeout(()=>void syncNow(),650);return()=>clearTimeout(timeout);
  },[revision,user,syncNow]);
  useEffect(()=>{const online=()=>void syncNow();window.addEventListener("online",online);return()=>window.removeEventListener("online",online);},[syncNow]);

  const clearAuthError=useCallback(()=>setAuthError(""),[]);
  function setFields(values:Record<string,FieldValue>){if(!ready)return;publish(withFields(dataRef.current,values));setRevision(r=>r+1);if(userRef.current)setSync("saving");}
  function complete(id:string){if(!ready||!userRef.current||dataRef.current.completions[id]||!Object.hasOwn(rewards,id))return 0;publish(awardForUser(dataRef.current,id,userRef.current.uid));setRevision(r=>r+1);if(userRef.current)setSync("saving");return rewards[id];}
  async function authenticate(action:(api:FirebaseServices)=>Promise<unknown>){
    if(authBusy)return false;
    if(!services.current){setAuthError(firebaseConfigured?"auth/network-request-failed":"auth/operation-not-allowed");return false;}
    setAuthError("");setAuthBusy(true);
    try{await action(services.current);return true;}catch(error){const code=errorCode(error);if(code!=="auth/popup-closed-by-user"&&code!=="auth/cancelled-popup-request")setAuthError(code);return false;}finally{setAuthBusy(false);}
  }
  const login=()=>authenticate(api=>api.login());
  const emailLogin=(email:string,password:string)=>authenticate(api=>api.emailLogin(email,password));
  const register=(email:string,password:string)=>authenticate(api=>api.register(email,password));
  const resetPassword=(email:string)=>authenticate(api=>api.resetPassword(email));
  async function logout(){
    if(!services.current||authBusy)return;setAuthBusy(true);setAuthError("");
    try{await syncNow();await services.current.logout();}catch(error){setAuthError(errorCode(error));}finally{setAuthBusy(false);}
  }
  return <LearningContext.Provider value={{data,ready,user,configured:firebaseConfigured,authBusy,authError,sync,storageAvailable,setFields,complete,login,emailLogin,register,resetPassword,clearAuthError,logout,retry:()=>void syncNow()}}>{children}</LearningContext.Provider>;
}
export function useLearning(){const context=useContext(LearningContext);if(!context)throw new Error("LearningProvider is required");return context;}
export function field<T extends FieldValue>(data:LearningData,key:string,fallback:T):T{return (data.fields[key]?.value??fallback) as T;}
