"use client";
import { useState } from "react";
import { ArrowRight, Pin, X } from "lucide-react";
import { content, type Locale } from "@/lib/i18n";
import { learningUI } from "@/lib/learning-ui";
import { authCopy } from "@/lib/auth-i18n";
import { freeWallKey, wallNotes } from "@/lib/wall";
import { useLearning } from "./LearningProvider";
export default function FearWall({locale}:{locale:Locale}){
 const {data,setFields,user,ready}=useLearning();const t=learningUI[locale];const old=content[locale].wall;const [draft,setDraft]=useState("");const notes=wallNotes(data);const slot=freeWallKey(data);const full=notes.length>=20||!slot;
 function add(event:React.FormEvent){event.preventDefault();if(!ready||!slot||full||!draft.trim())return;setFields({[slot]:draft.trim()});setDraft("");}
 return <section className="wall-section"><div className="shell wall-layout"><div><span className="section-tag"><Pin size={16}/>{old.tag}</span><h1>{t.wallTitle}</h1><p>{t.wallLead}</p><form className="wall-input" onSubmit={add}><label htmlFor="wall-thought">{t.wallLabel}</label><textarea id="wall-thought" value={draft} onChange={e=>setDraft(e.target.value)} maxLength={140} placeholder={t.wallHint} rows={4}/><div><span>{draft.length}/140</span><button className="btn btn-dark" disabled={!ready||full||!draft.trim()}>{t.wallAdd}<ArrowRight size={16}/></button></div><small>{full?t.wallLimit:user?t.wallPrivate:authCopy[locale].sessionOnly}</small></form><div className="wall-ideas"><strong>{t.examples}</strong>{old.examples.map(text=><button type="button" key={text} onClick={()=>setDraft(text)} disabled={full}>{text}<span aria-hidden="true">＋</span></button>)}</div></div><div className="pinboard"><div className="pinboard-top"><span>{old.board}</span><strong>{notes.length}/20 · {t.wallCount}</strong></div>{!notes.length?<div className="pinboard-empty"><Pin size={32}/><p>{t.wallEmpty}</p></div>:<div className="pinboard-notes">{notes.map(note=><article className={`pinned-note paper-${note.slot%4}`} key={note.key} style={{"--tilt":`${[-3,2,-1.5,3,1,-2][note.slot%6]}deg`} as React.CSSProperties}><span className="paper-pin" aria-hidden="true"/><p>{note.text}</p><small>{old.mine}</small><button type="button" onClick={()=>setFields({[note.key]:""})} aria-label={`${t.remove}: ${note.text}`}><X size={17}/></button></article>)}</div>}</div></div></section>;
}
