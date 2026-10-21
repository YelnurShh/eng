"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { learningUI, readinessMessage } from "@/lib/learning-ui";
import { authCopy } from "@/lib/auth-i18n";
import { authHref } from "@/lib/auth-policy";
import { field, useLearning } from "./LearningProvider";
export function ConfidenceSummary({locale}:{locale:Locale}){
 const {data}=useLearning();const t=learningUI[locale];const before=field<number|null>(data,"before",null);const after=field<number|null>(data,"after",null);
 return <><h2>{t.checkTitle}</h2><p className="readiness-help">{t.checkHelp}</p>{before===null||after===null?<p>{t.notSet}</p>:<><div className="confidence-values"><div><span>{t.before}</span><strong>{before}<small>/10</small></strong></div><ArrowRight size={19}/><div><span>{t.after}</span><strong>{after}<small>/10</small></strong></div></div><p className="readiness-help">{readinessMessage(before,after,locale)}</p></>}<Link className="text-link" href={`/${locale}/progress`}>{t.compare}<ArrowRight size={16}/></Link></>;
}
export default function ConfidenceCheck({locale}:{locale:Locale}){
 const {data,setFields,complete,ready,user}=useLearning();const t=learningUI[locale];
 const [before,setBefore]=useState<number|null>(()=>field(data,"before",null));const [after,setAfter]=useState<number|null>(()=>field(data,"after",null));const [saved,setSaved]=useState(false);
 const [dirty,setDirty]=useState(false);const storedBefore=field<number|null>(data,"before",null);const storedAfter=field<number|null>(data,"after",null);
 useEffect(()=>{if(!dirty){setBefore(storedBefore);setAfter(storedAfter);}},[dirty,storedBefore,storedAfter]);
 const values=[{id:"before",label:t.before,value:before,set:setBefore},{id:"after",label:t.after,value:after,set:setAfter}];
 return <section className="growth-section"><div className="shell readiness-layout"><div><span className="section-tag"><MessageCircle size={16}/>{t.compare}</span><h1>{t.checkTitle}</h1><p>{t.checkLead}</p><div className="readiness-definition"><strong>{t.checkQuestion}</strong><p>{t.checkHelp}</p></div><ol className="readiness-scale"><li>{t.low}</li><li>{t.middle}</li><li>{t.high}</li></ol><Link className="text-link" href={`/${locale}/speaking-room`} target="_blank" rel="noopener noreferrer">{t.practice} <span className="sr-only">{locale==="kk"?"(жаңа қойындыда)":locale==="ru"?"(в новой вкладке)":"(in a new tab)"}</span><ArrowRight size={17}/></Link></div><div className="readiness-card">{values.map(item=><fieldset key={item.id}><legend>{item.label}</legend><p>{t.select}: <strong>{item.value===null?"—":`${item.value}/10`}</strong></p><div className="rating-buttons" role="group" aria-label={item.label}>{Array.from({length:10},(_,i)=>i+1).map(value=><button type="button" key={value} aria-pressed={item.value===value} disabled={!ready} onClick={()=>{item.set(value);setDirty(true);setSaved(false);}}>{value}</button>)}</div><div className="rating-ends"><span>{t.low}</span><span>{t.high}</span></div></fieldset>)}{before!==null&&after!==null&&<p className="readiness-result" role="status">{readinessMessage(before,after,locale)}</p>}{user?<button className="btn btn-dark" disabled={!ready||before===null||after===null} onClick={()=>{setFields({before,after});complete("confidence-check");setSaved(true);setDirty(false);}}><Check size={18}/>{saved?t.saved:t.save}</button>:<Link className="btn btn-dark" href={authHref(locale,"login",`/${locale}/progress`)}>{authCopy[locale].signInSave}<ArrowRight size={17}/></Link>}</div></div></section>;
}
