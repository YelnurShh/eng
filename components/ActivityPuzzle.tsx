"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, Volume2, X } from "lucide-react";
import { shuffle, type Activity } from "@/lib/activities";
import type { Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-i18n";

export default function ActivityPuzzle({activity,locale,onSolved}:{activity:Activity;locale:Locale;onSolved:()=>void}){
  const p=platform[locale];const [choices]=useState(()=>shuffle(activity.choices,activity.id.charCodeAt(0)*100+Number(activity.id.slice(1))+31));
  const [selected,setSelected]=useState<number[]>([]);const [wrong,setWrong]=useState<number|null>(null);const [state,setState]=useState<"ready"|"wrong"|"correct">("ready");
  const [audioError,setAudioError]=useState(false);
  useEffect(()=>()=>{window.speechSynthesis?.cancel();},[]);
  const solved=state==="correct";
  function check(answer:string,index?:number){if(solved)return;if(answer===activity.answer){setState("correct");setWrong(null);onSolved();}else{setState("wrong");setWrong(index??null);}}
  function listen(){if(!("speechSynthesis" in window)){setAudioError(true);return;}window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(activity.answer);voice.lang="en-US";voice.rate=.85;window.speechSynthesis.speak(voice);}
  return <div className="activity-puzzle">
    <div className="puzzle-instruction">{activity.kind==="word"?p.selectWord:activity.kind==="sentence"?p.buildSentence:p.chooseReply}</div>
    <h2 className="puzzle-prompt" lang={activity.prompt?"en":locale}>{activity.prompt||activity.hint[locale]}</h2>
    {activity.prompt&&<p className="puzzle-hint">{activity.hint[locale]}</p>}
    {activity.kind==="sentence"?<>
      <div className={`sentence-output ${state}`} aria-live="polite">{selected.length?selected.map((choice,index)=><button key={`${choice}-${index}`} disabled={solved} onClick={()=>{setSelected(current=>current.filter((_,i)=>i!==index));setState("ready");}} lang="en">{choices[choice]}{!solved&&<X size={12}/>}</button>):<span>{p.emptySentence}</span>}</div>
      <div className="word-tiles">{choices.map((word,index)=><button lang="en" key={`${word}-${index}`} disabled={solved||selected.includes(index)} onClick={()=>{setSelected(current=>[...current,index]);setState("ready");}}>{word}</button>)}</div>
      <div className="puzzle-actions"><button className="btn btn-dark" disabled={solved||selected.length!==choices.length} onClick={()=>check(selected.map(i=>choices[i]).join(" "))}>{p.check}<Check size={18}/></button><button className="icon-text" disabled={solved||!selected.length} onClick={()=>{setSelected([]);setState("ready");}}><RotateCcw size={16}/>{p.reset}</button></div>
    </>:<div className="answer-choices">{choices.map((answer,index)=><button key={answer} lang="en" disabled={solved} className={`${solved&&answer===activity.answer?"answer-correct":""} ${wrong===index?"answer-wrong":""}`} onClick={()=>check(answer,index)}><span>{String.fromCharCode(65+index)}</span>{answer}{solved&&answer===activity.answer&&<Check size={19}/>}</button>)}</div>}
    <div aria-live="polite" className={`puzzle-feedback ${state}`}>{state==="correct"?<><strong><Check size={18}/>{p.correct}</strong><p>{activity.explanation[locale]}</p><button className="icon-text" onClick={listen}><Volume2 size={17}/>{p.listen}</button>{audioError&&<span>{locale==="kk"?"Аудио бұл браузерде қолжетімсіз.":locale==="ru"?"Аудио недоступно в этом браузере.":"Audio is unavailable in this browser."}</span>}</>:state==="wrong"?<strong>{p.incorrect}</strong>:null}</div>
  </div>;
}
