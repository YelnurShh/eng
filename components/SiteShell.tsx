"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AudioLines, Globe2, GraduationCap, Sparkles, UserRound } from "lucide-react";
import { content, languageNames, locales, type Locale, type SectionSlug } from "@/lib/i18n";
import { platform } from "@/lib/platform-i18n";
import { authHref, safeReturnPath } from "@/lib/auth-policy";
import { isAuthSection } from "@/lib/auth-i18n";
import GuestNotice from "./GuestNotice";
import { totalXP } from "@/lib/progress";
import { useLearning } from "./LearningProvider";

export default function SiteShell({locale,section,children}:{locale:Locale;section?:SectionSlug;children:React.ReactNode}){
  const router=useRouter();const t=content[locale];const p=platform[locale];const {data,user}=useLearning();
  useEffect(()=>{document.documentElement.lang=locale;},[locale]);
  const tabs=[{key:"home",label:t.nav.home,href:`/${locale}`},{key:"games",label:p.games,href:`/${locale}/games`},{key:"challenge",label:t.nav.challenge,href:`/${locale}/challenge`},{key:"speaking-room",label:t.nav.speaking,href:`/${locale}/speaking-room`},{key:"test",label:t.nav.test,href:`/${locale}/test`},{key:"progress",label:t.nav.progress,href:`/${locale}/progress`},{key:"fear-wall",label:t.nav.wall,href:`/${locale}/fear-wall`},{key:"mirror",label:t.nav.mirror,href:`/${locale}/mirror`},{key:"cycle",label:t.nav.cycle,href:`/${locale}/cycle`}];
  return <div className="site-wrap"><a href="#main-content" className="skip-link">{locale==="kk"?"Мазмұнға өту":locale==="ru"?"К содержимому":"Skip to content"}</a><header className="site-header-light"><div className="shell header-main"><Link href={`/${locale}`} className="school-logo" aria-label="Speak Without Fear"><span className="school-logo-icon"><AudioLines size={24}/></span><span>Speak <strong>Without Fear<span className="brand-dot">.</span></strong></span></Link><div className="header-teacher"><GraduationCap size={18}/><span><small>{t.role}</small><strong>{t.teacher}</strong></span></div><div className="header-actions">{user&&<Link href={`/${locale}/profile`} className="header-xp" aria-label={`${p.points}: ${totalXP(data)} XP`}><Sparkles size={16}/><strong>{totalXP(data)}</strong> XP</Link>}<label className="language-select"><Globe2 size={17}/><span className="sr-only">{t.language}</span><select aria-label={t.language} value={locale} onChange={event=>router.push(section&&isAuthSection(section)?authHref(event.target.value as Locale,section,safeReturnPath(new URLSearchParams(window.location.search).get("next"),event.target.value as Locale)):`/${event.target.value}${section?`/${section}`:""}`)}>{locales.map(language=><option value={language} key={language}>{languageNames[language]}</option>)}</select></label><Link href={user?`/${locale}/profile`:authHref(locale,"login",`/${locale}${section&&!isAuthSection(section)?`/${section}`:""}`)} aria-label={user?p.profile:p.login} className={`header-account ${section==="profile"?"active":""}`}><UserRound size={17}/><span>{user?p.profile:p.login}</span></Link></div></div><nav className="tab-bar" aria-label={locale==="kk"?"Сайт беттері":locale==="ru"?"Страницы сайта":"Site pages"}><div className="shell tab-scroll">{tabs.map(tab=><Link key={tab.key} href={tab.href} className={tab.key===(section??"home")?"active":""} aria-current={tab.key===(section??"home")?"page":undefined}>{tab.label}</Link>)}</div></nav></header><div id="main-content" tabIndex={-1} className="main-content">{section&&!isAuthSection(section)&&section!=="profile"&&<div className="shell"><GuestNotice locale={locale} next={`/${locale}/${section}`}/></div>}{children}</div><footer className="site-footer"><div className="shell"><Link className="footer-brand" href={`/${locale}`}><AudioLines size={20}/>Speak Without Fear<span>.</span></Link><span>{t.footer}</span><span>{t.teacher}</span></div></footer></div>;
}
