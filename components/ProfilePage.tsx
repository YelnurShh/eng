"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, Check, Flag, Flame, MessageCircle, Sparkles, Star, Target, Trophy } from "lucide-react";
import { content, type Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-i18n";
import { weekday, shortDate } from "@/lib/date-format";
import { activities, rewards, speakingPrompts } from "@/lib/activities";
import { dailyCounts, localDay, totalXP } from "@/lib/progress";
import { field, useLearning } from "./LearningProvider";
import { ConfidenceSummary } from "./ConfidenceCheck";
import { wallNotes } from "@/lib/wall";
import { ProfileRequired } from "./GuestNotice";
import AccountPanel from "./AccountPanel";
import LearningStats from "./LearningStats";

export default function ProfilePage({locale}:{locale:Locale}){
  const {data,user,setFields,ready}=useLearning();const p=platform[locale];const t=content[locale];const [nameSaved,setNameSaved]=useState(false);
  const xp=totalXP(data);const level=Math.floor(xp/150)+1;const goal=field(data,"goal",3);const counts=dailyCounts(data);const today=counts[localDay()]??0;
  const completions=Object.entries(data.completions).filter(([id])=>rewards[id]>0).sort((a,b)=>b[1]-a[1]);
  const responses=speakingPrompts.filter(prompt=>field(data,`response-${prompt.id}`,"").trim());
  const days=Array.from({length:7},(_,i)=>{const date=ready?new Date():new Date(2024,0,7,12);date.setDate(date.getDate()-6+i);return {date,key:localDay(date),count:counts[localDay(date)]??0};});const max=Math.max(goal,...days.map(d=>d.count));
  const stepCount=Array.from({length:7},(_,i)=>data.completions[`challenge-${i+1}`]).filter(Boolean).length;
  const badges=[{icon:Star,name:p.badgeFirst,done:completions.length>0},{icon:Trophy,name:p.badgeFive,done:completions.length>=5},{icon:MessageCircle,name:p.badgeSpeaker,done:completions.some(([id])=>id.startsWith("speak-"))},{icon:Flag,name:p.badgeWeek,done:stepCount===7}];
  const answers=field<(number|null)[]>(data,"answers",Array(10).fill(null));const answered=answers.filter(a=>a!==null).length;
  function label(id:string){if(id.startsWith("game-")){const item=activities.find(a=>`game-${a.id}`===id);return item?.prompt||item?.answer||p.games;}if(id.startsWith("speak-"))return p.practiceLabel;if(id.startsWith("challenge-"))return `${p.day} ${id.split("-")[1]} · ${p.challengeLabel}`;return ({"first-word":p.firstWord,"fear-test":p.quizLabel,"mirror-thought":p.mirrorLabel,"confidence-check":p.reflectLabel})[id]??p.completed;}
  if(!ready||!user)return <ProfileRequired locale={locale}/>;
  return <section className="profile-section"><div className="shell"><div className="profile-heading"><div><span className="section-tag"><Sparkles size={15}/>{p.profileTag}</span><h1>{field(data,"name","")||user?.displayName||p.profileTitle}</h1><p>{p.profileText}</p></div><div className="profile-avatar" aria-hidden="true">{(field(data,"name","")||user?.displayName||"SW").slice(0,2).toUpperCase()}<span><Check size={13}/></span></div></div>
    <AccountPanel locale={locale}/><LearningStats locale={locale}/>
    <div className="profile-grid"><div className="profile-main-column">
      <div className="dashboard-card level-card"><div><span className="eyebrow">{p.level} {level}</span><h2>{p.nextLevel}: {150-xp%150} XP</h2><p>{p.rewardNote}</p></div><div className="level-track"><span style={{transform:`scaleX(${xp%150/150})`}}/></div><div className="level-track-label"><span>{xp%150}/150 XP</span><Sparkles size={17}/></div></div>
      <div className="dashboard-card"><div className="dashboard-card-top"><h2>{p.activityWeek}</h2><Flame size={21}/></div><div className="activity-chart">{days.map(day=><div key={day.key}><strong>{day.count}</strong><div className="chart-track"><span style={{height:`${Math.max(4,day.count/max*100)}%`}} className={day.count?"has-activity":""}/></div><span>{weekday(day.date,locale)}</span></div>)}</div></div>
      <div className="dashboard-card"><div className="dashboard-card-top"><h2>{p.history}</h2><Award size={21}/></div>{!completions.length?<div className="empty-state"><Trophy size={30}/><p>{p.emptyHistory}</p><Link className="text-link" href={`/${locale}/games`}>{p.play}<ArrowRight size={16}/></Link></div>:<div className="achievement-list">{completions.slice(0,8).map(([id,time])=><div key={id}><span className="achievement-check"><Check size={16}/></span><div><strong>{label(id)}</strong><small>{shortDate(time,locale)}</small></div><span>+{rewards[id]} XP</span></div>)}</div>}</div>
      <div className="dashboard-card"><div className="dashboard-card-top"><h2>{t.nav.test}</h2><span className="xp-chip">{answered}/10</span></div><div className="saved-responses"><details><summary>{t.test.title}</summary>{t.test.questions.map((question,index)=><div className="profile-answer" key={question}><strong>{question}</strong><span>{answers[index]===null?"—":t.test.options[answers[index] as number]}</span></div>)}</details></div><Link className="text-link" href={`/${locale}/test`}>{answered===10?p.replay:p.continue}<ArrowRight size={16}/></Link></div>
      <div className="dashboard-card"><div className="dashboard-card-top"><h2>{p.responses}</h2><MessageCircle size={21}/></div>{!responses.length?<div className="empty-state"><p>{p.emptyResponses}</p><Link className="text-link" href={`/${locale}/speaking-room`}>{t.nav.speaking}<ArrowRight size={16}/></Link></div>:<div className="saved-responses">{responses.map(prompt=><details key={prompt.id}><summary lang="en">{prompt.prompt}</summary><p lang="en">{field(data,`response-${prompt.id}`,"")}</p></details>)}</div>}</div>
    </div><aside className="profile-side-column">
      <div className="dashboard-card goal-card"><span className="goal-icon"><Target size={25}/></span><h2>{p.dailyGoal}</h2><strong className="goal-number">{today}<span> / {goal}</span></strong><p>{p.goalText}</p><label htmlFor="daily-goal">{p.goal}</label><select id="daily-goal" value={goal} disabled={!ready} onChange={event=>setFields({goal:Number(event.target.value)})}>{[3,5,10].map(value=><option key={value} value={value}>{value} {p.activities.toLowerCase()}</option>)}</select></div>
      <div className="dashboard-card"><h2>{p.badges}</h2><div className="badge-grid">{badges.map(badge=><div key={badge.name} className={badge.done?"badge unlocked":"badge"} title={badge.done?p.completed:p.badgeLocked}><span><badge.icon size={25}/></span><strong>{badge.name}</strong><small>{badge.done?p.completed:p.badgeLocked}</small></div>)}</div></div>
      <div className="dashboard-card"><ConfidenceSummary locale={locale}/></div>
      <div className="dashboard-card"><h2>{t.nav.wall}</h2>{wallNotes(data).length?<ul className="profile-wall-notes">{wallNotes(data).map(item=><li key={item.key}>{item.text}</li>)}</ul>:<p>{p.noReflection}</p>}<Link className="text-link" href={`/${locale}/fear-wall`}>{t.nav.wall}<ArrowRight size={16}/></Link></div>
      <form className="dashboard-card profile-settings" onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);const name=String(form.get("name")??"").trim();setFields({name});setNameSaved(true);}}><h2>{p.settings}</h2><label htmlFor="profile-name">{p.name}</label><input key={`${user?.uid??"guest"}-${ready}`} id="profile-name" name="name" defaultValue={field(data,"name","")} maxLength={60} placeholder={p.namePlaceholder}/><button className="btn btn-dark" disabled={!ready}>{p.save}<Check size={16}/></button>{nameSaved&&<p role="status">{p.nameSaved}</p>}</form>
    </aside></div>
  </div></section>;
}
