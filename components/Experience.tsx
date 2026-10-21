"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Heart, RotateCcw, Sparkles } from "lucide-react";
import { fears, questions, type FearKey } from "@/lib/content";
import { content, type Locale, type SectionSlug } from "@/lib/i18n";
import SiteShell from "./SiteShell";
import { field, useLearning } from "./LearningProvider";
import type { FieldValue } from "@/lib/progress";
import AuthPage from "./AuthPage";
import { isAuthSection } from "@/lib/auth-i18n";
import FearWall from "./FearWall";
import ConfidenceCheck from "./ConfidenceCheck";
import MindsetPractice from "./MindsetPractice";
import GamesPage from "./GamesPage";
import ProfilePage from "./ProfilePage";
import ChallengeBoard from "./ChallengeBoard";
import SpeakingRoom from "./SpeakingRoom";

type Saved={answers:(number|null)[];before:number|null;after:number|null;note:string};
const emptyAnswers:(number|null)[]=Array(questions.length).fill(null);
function Tag({children}:{children:React.ReactNode}){return <span className="section-tag"><span className="tag-dot"/>{children}</span>;}

export default function Experience({locale,section}:{locale:Locale;section:SectionSlug}){
  const t=content[locale];const {data,setFields,complete,ready}=useLearning();
  const saved:Saved={answers:field(data,"answers",emptyAnswers),before:field<number|null>(data,"before",null),after:field<number|null>(data,"after",null),note:field(data,"note","")};
  const [quizStep,setQuizStep]=useState(0);const [resultMode,setShowResult]=useState<boolean|null>(null);
  const answered=saved.answers.every(answer=>answer!==null);const showResult=resultMode??answered;
  const results=useMemo(()=>(Object.keys(fears) as FearKey[]).map(key=>{
    const values=questions.flatMap((question,index)=>question.category===key&&saved.answers[index]!==null?[saved.answers[index] as number]:[]);
    return {key,score:values.length?Math.round(values.reduce((sum,value)=>sum+value,0)/(values.length*3)*100):0};
  }).sort((a,b)=>b.score-a.score),[saved.answers]);
  const primary=results[0];
  function setSaved(update:(current:Saved)=>Saved){const next=update(saved);const changes:Record<string,FieldValue>={};for(const key of ["answers","before","after","note"] as const)if(JSON.stringify(next[key])!==JSON.stringify(saved[key]))changes[key]=next[key];if(Object.keys(changes).length)setFields(changes);}
  function chooseAnswer(value:number){setShowResult(false);setSaved(current=>({...current,answers:current.answers.map((answer,index)=>index===quizStep?value:answer)}));}
  function advanceQuiz(){if(quizStep<questions.length-1)setQuizStep(quizStep+1);else{setShowResult(true);complete("fear-test");}}
  function restartQuiz(){setFields({answers:emptyAnswers});setQuizStep(0);setShowResult(false);}
  return <SiteShell locale={locale} section={section}><main className="school-page">
    {isAuthSection(section)&&<AuthPage locale={locale} mode={section}/>}
    {section === "test" && <section className="quiz-section"><div className="shell quiz-layout"><div className="quiz-intro"><Tag>{t.test.tag}</Tag><h1>{t.test.title}</h1><p>{t.test.description}</p><div className="quiz-aside"><Heart size={20} /><span>{t.test.privacy}</span></div></div><div className="quiz-card">
      {showResult && answered ? <div className="result-content"><div className="quiz-card-top"><span>{t.test.resultTag}</span><Sparkles size={19} /></div><div className="result-lead">{t.test.resultLead}</div><h2>{t.test.fears[primary.key].label}<span className="result-period">.</span></h2><p>{t.test.fears[primary.key].description}</p><div className="score-list">{results.map(({ key, score }) => <div className="score-row" key={key}><div><span>{t.test.fears[key].short}</span><strong>{score}%</strong></div><div className="score-track"><span style={{ width: `${score}%`, background: fears[key].color }} /></div></div>)}</div><div className="mission-box"><span>{t.test.firstMission}</span><p>{t.test.fears[primary.key].mission}</p></div><div className="result-actions"><Link className="btn btn-dark" href={`/${locale}/challenge`}>{t.test.startChallenge}<ArrowRight size={17} /></Link><button className="icon-text" onClick={restartQuiz}><RotateCcw size={16} />{t.test.retake}</button></div></div> : <div className="question-content"><div className="quiz-card-top"><span>{t.nav.test.toUpperCase()}</span><span>{String(quizStep + 1).padStart(2, "0")} / {questions.length}</span></div><div className="quiz-progress"><span style={{ width: `${((quizStep + 1) / questions.length) * 100}%` }} /></div><div className="question-label">{t.test.questionLabel}</div><h2>{t.test.questions[quizStep]}</h2><div className="quiz-options">{t.test.options.map((option, value) => <button key={value} className={saved.answers[quizStep] === value ? "selected" : ""} disabled={!ready} onClick={() => chooseAnswer(value)}><span className="radio-mark">{saved.answers[quizStep] === value && <Check size={14} />}</span>{option}</button>)}</div><div className="quiz-controls"><button onClick={() => setQuizStep(Math.max(0, quizStep - 1))} disabled={quizStep === 0}><ChevronLeft size={17} />{t.test.back}</button><button className="btn btn-dark" onClick={advanceQuiz} disabled={!ready||saved.answers[quizStep] === null}>{quizStep === questions.length - 1 ? t.test.seeResult : t.test.next}<ChevronRight size={17} /></button></div></div>}
    </div></div></section>}

    {section === "cycle" && <MindsetPractice key="cycle" locale={locale} mode="cycle"/>}

    {section === "games" && <GamesPage locale={locale}/>}
    {section === "profile" && <ProfilePage locale={locale}/>}
    {section === "challenge" && <ChallengeBoard locale={locale}/>}
    {section === "speaking-room" && <SpeakingRoom locale={locale}/>}

    {section === "progress" && <ConfidenceCheck locale={locale}/>}

    {section === "fear-wall" && <FearWall locale={locale}/>}

    {section === "mirror" && <MindsetPractice key="mirror" locale={locale} mode="mirror"/>}
  </main></SiteShell>;
}
