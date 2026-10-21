"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flag, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { activityById, challengePrograms } from "@/lib/activities";
import type { Locale } from "@/lib/i18n";
import { authCopy } from "@/lib/auth-i18n";
import { platform } from "@/lib/platform-i18n";
import { useLearning } from "./LearningProvider";
import ActivityPuzzle from "./ActivityPuzzle";

export default function ChallengeBoard({locale}:{locale:Locale}){
  const p=platform[locale];const {data,complete,ready,user}=useLearning();const [day,setDay]=useState<number|null>(null);const [round,setRound]=useState(0);const [solved,setSolved]=useState(false);const [finished,setFinished]=useState(false);const [earned,setEarned]=useState(0);
  const done=challengePrograms.filter((_,i)=>data.completions[`challenge-${i+1}`]).length;
  function open(index:number){const first=challengePrograms[index].findIndex((_,r)=>!data.completions[`challenge-${index+1}-round-${r}`]);setDay(index);setRound(first<0?0:first);setSolved(false);setFinished(false);}
  function solve(){if(day===null)return;complete(`challenge-${day+1}-round-${round}`);if(round===2)setEarned(complete(`challenge-${day+1}`));setSolved(true);}
  return <section className="challenge-section"><div className="shell"><div className="page-intro"><span className="section-tag"><Flag size={15}/>{p.challengeLabel}</span><h1>{p.challengeTitle}</h1><p>{p.challengeText}</p></div>
    {day===null?<><div className="journey-progress"><span>{p.weekComplete}</span><strong>{done}/7</strong><div><span style={{transform:`scaleX(${done/7})`}}/></div></div><div className="journey-grid">{challengePrograms.map((program,i)=>{const complete=!!data.completions[`challenge-${i+1}`];const locked=!!user&&i>0&&!data.completions[`challenge-${i}`];const rounds=program.filter((_,r)=>data.completions[`challenge-${i+1}-round-${r}`]).length;return <button disabled={locked||!ready} className={`journey-step ${complete?"step-done":""}`} key={i} onClick={()=>open(i)}><span className="journey-number">{complete?<Check size={23}/>:locked?<LockKeyhole size={21}/>:String(i+1).padStart(2,"0")}</span><span className="journey-step-body"><small>{p.day} {i+1} · {rounds}/3</small><strong>{p.challengeNames[i]}</strong><span>{locked?p.locked:complete?p.replay:p.startStep}</span></span><span className="journey-xp">{complete?<Trophy size={20}/>:user?"+40 XP":authCopy[locale].practice}</span></button>;})}</div></>:finished?<div className="game-summary"><span className="summary-trophy"><Trophy size={42}/></span><span className="eyebrow">{p.day} {day+1}</span><h2>{p.stepDone}</h2>{user&&<div className="summary-xp">+{earned} XP</div>}<p>{p.challengeNames[day]}</p><button className="btn btn-dark" onClick={()=>setDay(null)}>{p.continue}<ArrowRight size={18}/></button></div>:<div className="play-stage"><div className="play-stage-top"><button className="icon-text" onClick={()=>setDay(null)}><ArrowLeft size={17}/>{p.challengeLabel}</button><span>{p.day} {day+1} · {round+1}/3</span><span className="xp-chip"><Sparkles size={14}/>{user?"40 XP":authCopy[locale].practice}</span></div><h2 className="challenge-stage-title">{p.challengeNames[day]}</h2><ActivityPuzzle key={`${day}-${round}`} activity={activityById(challengePrograms[day][round])} locale={locale} onSolved={solve}/>{solved&&<div className="round-result"><span><Check size={19}/>{p.correct}</span><button className="btn btn-dark" onClick={()=>{if(round===2)setFinished(true);else{setRound(r=>r+1);setSolved(false);}}}>{p.continue}<ArrowRight size={18}/></button></div>}</div>}
    <p className="muted-note">{user?p.challengeSaved:authCopy[locale].sessionOnly}</p></div></section>;
}
