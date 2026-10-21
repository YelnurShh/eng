"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Clock3, Mic, Pause, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { speakingPrompts } from "@/lib/activities";
import { content, type Locale } from "@/lib/i18n";
import { authCopy } from "@/lib/auth-i18n";
import { platform } from "@/lib/platform-i18n";
import { learningUI } from "@/lib/learning-ui";
import { hasEnglishResponse } from "@/lib/progress";
import { field, useLearning } from "./LearningProvider";

type Recognition={lang:string;continuous:boolean;interimResults:boolean;onresult:((event:{results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;onerror:((event:{error?:string})=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};

export default function SpeakingRoom({locale}:{locale:Locale}){
  const t=content[locale].speaking;const p=platform[locale];const {data,setFields,complete,ready,user}=useLearning();
  const [topic,setTopic]=useState(0);const [promptNumber,setPromptNumber]=useState(0);const [listening,setListening]=useState(false);const [error,setError]=useState("");const [seconds,setSeconds]=useState(60);const [running,setRunning]=useState(false);const [saved,setSaved]=useState(false);const [reward,setReward]=useState(0);
  const recognition=useRef<Recognition|null>(null);const bank=speakingPrompts.filter(item=>item.topic===topic);const prompt=bank[promptNumber%bank.length];const text=field(data,`response-${prompt.id}`,"");const words=(text.match(/[a-z]+(?:'[a-z]+)?/gi)??[]).length;const valid=hasEnglishResponse(text);
  useEffect(()=>{if(!running)return;const interval=setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);return()=>clearInterval(interval);},[running]);
  useEffect(()=>{if(seconds===0)setRunning(false);},[seconds]);
  useEffect(()=>()=>{recognition.current?.stop();window.speechSynthesis?.cancel();},[]);
  useEffect(()=>{const value=new URLSearchParams(window.location.search).get("topic");if(value!==null&&/^\d+$/.test(value)){const chosen=Number(value);if(chosen>=0&&chosen<t.topics.length)setTopic(chosen);}},[t.topics.length]);
  function stop(){recognition.current?.stop();setListening(false);}
  function change(topicIndex:number,next=0){stop();window.speechSynthesis?.cancel();setTopic(topicIndex);setPromptNumber(next);setSeconds(60);setRunning(false);setSaved(false);setReward(0);setError("");}
  function start(){
    const browser=window as Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};const Constructor=browser.SpeechRecognition||browser.webkitSpeechRecognition;
    setError("");if(!Constructor){setError(t.unavailable);return;}
    try{const voice=new Constructor();voice.lang="en-US";voice.continuous=true;voice.interimResults=false;const base=text.trim();voice.onresult=event=>{const transcript=Array.from(event.results).map(result=>result[0].transcript).join(" ");setFields({[`response-${prompt.id}`]:`${base}${base?" ":""}${transcript}`.slice(0,3000)});setSaved(false);};voice.onerror=()=>{setListening(false);setError(t.voiceFailed);};voice.onend=()=>setListening(false);recognition.current=voice;voice.start();setListening(true);}catch{setError(t.voiceFailed);}
  }
  function listen(){if(!("speechSynthesis" in window)){setError(t.audioUnavailable);return;}window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(prompt.prompt);voice.lang="en-US";voice.rate=.85;window.speechSynthesis.speak(voice);}
  return <section className="speaking-section"><div className="shell speaking-layout"><div className="speaking-copy"><span className="section-tag"><Mic size={15}/>{t.tag}</span><h1>{t.title}</h1><p>{t.description}</p><div className="speaking-side-note"><Sparkles size={25}/>{t.note}</div><div className="practice-goal"><span className="xp-chip">{user?"+25 XP":authCopy[locale].practice}</span><strong>{p.speakGoal}</strong><p>{user?p.rewardNote:authCopy[locale].signInPoints}</p></div></div>
    <div className="speaking-panel"><div className="panel-header"><span className="online-dot"/>{t.private}<span className="panel-private">{promptNumber%bank.length+1}/{bank.length}</span></div><div className="topic-selector"><span>{t.choose} · {t.topics.length} {learningUI[locale].topics} / {speakingPrompts.length} {learningUI[locale].questions}</span><div>{t.topics.map((name,i)=><button className={topic===i?"active":""} aria-pressed={topic===i} onClick={()=>change(i)} key={name}>{name}</button>)}</div></div><div className="prompt-card"><span>{t.letsTalk}</span><p lang="en">{prompt.prompt}</p><button onClick={listen}><Volume2 size={18}/>{t.listen}</button></div>
    <div className="speaking-timer"><div><Clock3 size={17}/><span>{p.timer}</span><strong>{seconds}s</strong></div><button disabled={seconds===0} onClick={()=>setRunning(value=>!value)}>{running?p.pauseTimer:p.startTimer}</button>{seconds===0&&<p role="status">{p.timerDone}</p>}</div>
    <div className="response-label"><span>{t.response}</span><span>{words}/8 {p.words}</span></div><textarea aria-label={t.response} value={text} disabled={!ready} maxLength={3000} onChange={event=>{setFields({[`response-${prompt.id}`]:event.target.value});setSaved(false);}} rows={5} placeholder={t.placeholder}/><div className="speaking-actions"><button className={`btn ${listening?"btn-stop":"btn-dark"}`} disabled={!ready} onClick={listening?stop:start}>{listening?<Pause size={17}/>:<Mic size={17}/>} {listening?t.stop:t.start}</button><button className="icon-text" disabled={!text||listening} onClick={()=>{setFields({[`response-${prompt.id}`]:""});setSaved(false);}}><RotateCcw size={16}/>{t.clear}</button></div>{error&&<p className="voice-error" role="status">{error}</p>}
    <div className="speaking-save"><button className="btn btn-dark" disabled={!user||!valid||!ready||listening} onClick={()=>{setReward(complete(`speak-${prompt.id}`));setSaved(true);setRunning(false);}}>{saved?<Check size={18}/>:<Sparkles size={18}/>} {!user?authCopy[locale].signInSave:saved?p.responseSaved:p.saveResponse}</button><button className="icon-text" onClick={()=>change(topic,promptNumber+1)}>{p.nextPrompt}<ArrowRight size={17}/></button></div><p className="speaking-reward" aria-live="polite">{saved?(reward?`+${reward} XP · ${p.correct}`:p.rewardOnce):!valid&&text?p.textOnly:""}</p><p className="microcopy">{t.disclaimer} {p.voiceService}</p></div>
  </div></section>;
}
