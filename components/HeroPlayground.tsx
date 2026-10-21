"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Headphones, Sparkles, Trophy } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { authCopy } from "@/lib/auth-i18n";
import { activities, shuffle } from "@/lib/activities";
import { learningUI } from "@/lib/learning-ui";
import { platform } from "@/lib/platform-i18n";
import { useLearning } from "./LearningProvider";

export default function HeroPlayground({locale}:{locale:Locale}){
  const p=platform[locale];const t=learningUI[locale];const {complete,ready,user}=useLearning();
  const [deck,setDeck]=useState(()=>activities.filter(item=>item.kind==="word"));const [index,setIndex]=useState(0);const [wrong,setWrong]=useState(false);const [reward,setReward]=useState<number|null>(null);const [showHint,setShowHint]=useState(false);
  const activity=deck[index];const done=reward!==null;
  useEffect(()=>{const bank=shuffle(activities.filter(item=>item.kind==="word"),Math.floor(Math.random()*2147483647));try{const last=sessionStorage.getItem("swf-hero-last");if(bank[0].id===last)bank.push(bank.shift()!);sessionStorage.setItem("swf-hero-last",bank[0].id);}catch{}setDeck(bank);},[]);
  function next(){const nextIndex=(index+1)%deck.length;setIndex(nextIndex);setReward(null);setWrong(false);setShowHint(false);try{sessionStorage.setItem("swf-hero-last",deck[nextIndex].id);}catch{}}
  function choose(word:string){if(word!==activity.answer){setWrong(true);return;}setWrong(false);setReward(complete(`game-${activity.id}`));}
  return <div className="voice-world"><div className="voice-glow" aria-hidden="true"/><div className="voice-orbit orbit-one" aria-hidden="true"/><div className="voice-orbit orbit-two" aria-hidden="true"/><span className="floating-icon icon-headphones" aria-hidden="true"><Headphones size={24}/></span><span className="floating-icon icon-sparkle" aria-hidden="true"><Sparkles size={25}/></span><div className="voice-bubble"><span className="bubble-overline">YOUR VOICE MATTERS</span><strong lang="en">Hello,<br/><span>confidence.</span></strong><div className="sound-wave" aria-hidden="true">{[14,26,38,21,47,34,23,44,29,17,35,24,13].map((height,i)=><span style={{height,animationDelay:`${i*65}ms`}} key={i}/>)}</div><span className="bubble-caption">{p.heroFloat}</span></div><div className="hero-mini-game"><div className="mini-game-top"><span><span className="live-dot"/>{t.heroTag}</span><span className="xp-chip">{user?`+${activity.xp} XP`:authCopy[locale].practice}</span></div><h2 lang="en">{done?activity.prompt.replace("___",activity.answer):activity.prompt.replace("___","_____")}</h2><p>{done?activity.explanation[locale]:p.heroCardHint}</p>{done?<><div className="hero-game-status" role="status"><Check size={17}/>{user?(reward?`+${reward} XP`:p.rewardOnce):authCopy[locale].signInPoints}</div><button className="mini-game-complete" onClick={next}>{t.next}<ArrowUpRight size={18}/></button></>:<><div className="mini-game-answers">{activity.choices.map(word=><button key={word} lang="en" disabled={!ready} onClick={()=>choose(word)}>{word}</button>)}</div><div className="hero-game-tools"><button onClick={()=>setShowHint(!showHint)} aria-expanded={showHint}>{t.hint}</button><button onClick={next}>{t.next} →</button></div>{showHint&&<p>{activity.hint[locale]}</p>}</>}{wrong&&<span className="mini-game-error" role="status">{p.incorrect}</span>}</div><span className="orbit-note"><Trophy size={15}/>{p.heroPill}</span></div>;
}
