"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Puzzle, Sparkles, Trophy, Zap } from "lucide-react";
import { activities, shuffle, type Activity, type GameKind } from "@/lib/activities";
import { authCopy } from "@/lib/auth-i18n";
import { platform } from "@/lib/platform-i18n";
import type { Locale } from "@/lib/i18n";
import { localDay } from "@/lib/progress";
import { useLearning } from "./LearningProvider";
import ActivityPuzzle from "./ActivityPuzzle";

export default function GamesPage({locale}:{locale:Locale}){
  const p=platform[locale];const {data,complete,ready,user}=useLearning();
  const [deck,setDeck]=useState<Activity[]>([]);const [round,setRound]=useState(0);const [solved,setSolved]=useState(false);const [earned,setEarned]=useState(0);const [total,setTotal]=useState(0);const [finished,setFinished]=useState(false);
  const [daily,setDaily]=useState<Activity>(activities[0]);
  useEffect(()=>{const seed=localDay().split("").reduce((sum,s)=>sum+s.charCodeAt(0),0);setDaily(activities[seed%activities.length]);},[]);
  const games=[{kind:"word" as const,icon:Zap,title:p.wordGame,text:p.wordGameText,color:"lavender"},{kind:"sentence" as const,icon:Puzzle,title:p.sentenceGame,text:p.sentenceGameText,color:"peach"},{kind:"dialogue" as const,icon:MessageCircle,title:p.dialogueGame,text:p.dialogueGameText,color:"mint"}];
  function start(kind:GameKind|null,dailyOnly=false){const source=dailyOnly?[daily]:shuffle(activities.filter(a=>a.kind===kind),Date.now()).sort((a,b)=>Number(!!data.completions[`game-${a.id}`])-Number(!!data.completions[`game-${b.id}`])).slice(0,5);setDeck(source);setRound(0);setSolved(false);setFinished(false);setTotal(0);setEarned(0);}
  function solve(){const xp=complete(`game-${deck[round].id}`);setEarned(xp);setTotal(t=>t+xp);setSolved(true);}
  return <section className="games-section"><div className="shell">
    <div className="page-intro"><span className="section-tag"><Sparkles size={15}/>{p.gamesTag}</span><h1>{p.gamesTitle}</h1><p>{p.gamesText}</p></div>
    {!deck.length?<><div className="game-picker">{games.map(game=>{const bank=activities.filter(a=>a.kind===game.kind);const done=bank.filter(a=>data.completions[`game-${a.id}`]).length;return <button className={`game-choice ${game.color}`} key={game.kind} disabled={!ready} onClick={()=>start(game.kind)}><span className="game-choice-top"><span className="game-icon"><game.icon size={27}/></span><span>{done}/{bank.length}<Check size={13}/></span></span><h2>{game.title}</h2><p>{game.text}</p><span className="game-choice-bottom"><strong>{p.play}</strong><ArrowRight size={20}/></span></button>;})}</div><div className="daily-pick"><div className="daily-pick-icon"><Sparkles size={26}/></div><div><span className="eyebrow">{p.dailyPick}</span><h2 lang="en">{daily.prompt||daily.hint[locale]}</h2><p>{p.dailyText}</p></div><button className="btn btn-dark" disabled={!ready} onClick={()=>start(null,true)}>{p.play}<ArrowRight size={18}/></button></div></>:finished?<div className="game-summary"><span className="summary-trophy"><Trophy size={42}/></span><span className="eyebrow">{p.solved}</span><h2>{deck.length} {p.activities.toLowerCase()}</h2>{user&&<div className="summary-xp">+{total} XP</div>}<p>{!user?authCopy[locale].practiceDone:total?p.correct:p.rewardOnce}</p><button className="btn btn-dark" onClick={()=>setDeck([])}>{p.chooseGame}<ArrowRight size={18}/></button></div>:<div className="play-stage"><div className="play-stage-top"><button className="icon-text" onClick={()=>setDeck([])}><ArrowLeft size={17}/>{p.games}</button><span>{p.round} {round+1}/{deck.length}</span><span className="xp-chip">{user?`+${deck[round].xp} XP`:authCopy[locale].practice}</span></div><div className="round-dots">{deck.map((item,i)=><span key={item.id} className={i<round?"done":i===round?"current":""}/>)}</div><ActivityPuzzle key={`${deck[round].id}-${round}`} activity={deck[round]} locale={locale} onSolved={solve}/>{solved&&<div className="round-result"><span className="round-reward">{!user?authCopy[locale].practiceDone:earned?`+${earned} XP`:p.rewardOnce}</span><button className="btn btn-dark" onClick={()=>{if(round===deck.length-1)setFinished(true);else{setRound(r=>r+1);setSolved(false);setEarned(0);}}}>{p.continue}<ArrowRight size={18}/></button></div>}</div>}
    <p className="muted-note">{user?p.rewardNote:authCopy[locale].signInPoints}</p>
  </div></section>;
}
