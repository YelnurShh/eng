"use client";

import { Flame, Sparkles, Target, Trophy } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-i18n";
import { rewards } from "@/lib/activities";
import { dailyCounts, localDay, streakDays, totalXP } from "@/lib/progress";
import { useLearning } from "./LearningProvider";

export default function LearningStats({locale}:{locale:Locale}){
  const {data,user}=useLearning();const p=platform[locale];const xp=totalXP(data);const goal=Number(data.fields.goal?.value??3);const today=dailyCounts(data)[localDay()]??0;const count=Object.keys(data.completions).filter(id=>rewards[id]>0).length;
  const items=[{icon:Trophy,value:xp,label:p.points,color:"violet"},{icon:Sparkles,value:Math.floor(xp/150)+1,label:p.level,color:"blue"},{icon:Flame,value:streakDays(data),label:p.streak,color:"orange"},{icon:Target,value:`${today}/${goal}`,label:p.dailyGoal,color:"green"}];
  if(!user)return null;
  return <div className="learning-stats">{items.map(item=><div className="stat-card" key={item.label}><span className={`stat-icon ${item.color}`}><item.icon size={21}/></span><strong>{item.value}</strong><span>{item.label}</span></div>)}<span className="sr-only">{p.all}: {count} {p.activities}</span></div>;
}
