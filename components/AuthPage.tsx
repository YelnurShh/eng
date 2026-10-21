"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, GraduationCap } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { authCopy, authErrorText, type AuthSection } from "@/lib/auth-i18n";
import { authHref, safeReturnPath } from "@/lib/auth-policy";
import { useLearning } from "./LearningProvider";

export default function AuthPage({locale,mode}:{locale:Locale;mode:AuthSection}){
  const t=authCopy[locale];const router=useRouter();
  const {user,ready,configured,authBusy,authError,clearAuthError,login,emailLogin,register,resetPassword}=useLearning();
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");
  const [visible,setVisible]=useState(false);const [error,setError]=useState("");const [sent,setSent]=useState(false);const [next,setNext]=useState(`/${locale}/profile`);
  const signup=mode==="register";const reset=mode==="reset-password";
  useEffect(()=>{setNext(safeReturnPath(new URLSearchParams(window.location.search).get("next"),locale));},[locale,mode]);
  useEffect(()=>{if(ready&&user)router.replace(safeReturnPath(new URLSearchParams(window.location.search).get("next"),locale));},[user,ready,router,locale]);
  // Reset page-specific messages when navigating between the separate auth pages.
  useEffect(()=>{setError("");setSent(false);setPassword("");setConfirm("");clearAuthError();},[mode,clearAuthError]);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");setSent(false);
    if(signup&&password.length<8){setError(t.tooShort);return;}
    if(signup&&password!==confirm){setError(t.mismatch);return;}
    if(reset){if(await resetPassword(email.trim()))setSent(true);}
    else if(signup)await register(email.trim(),password);
    else await emailLogin(email.trim(),password);
  }
  const disabled=!ready||authBusy||!configured||!!user;
  return <section className="auth-section shell"><aside className="auth-story"><span className="section-tag"><GraduationCap size={18}/>Speak Without Fear</span><h2>{t.benefitTitle}<span>.</span></h2><ul>{t.benefits.map(benefit=><li key={benefit}><span><Check size={18}/></span>{benefit}</li>)}</ul><div className="auth-art" aria-hidden="true"><span>Aa</span><span>✦</span><span>Hello!</span></div><Link href={`/${locale}/games`} className="text-link">{t.continuePractice}<ArrowRight size={17}/></Link></aside><div className="auth-card" key={mode}>
    <span className="eyebrow">{reset?t.reset:signup?t.register:t.login}</span><h1>{reset?t.resetTitle:signup?t.registerTitle:t.loginTitle}</h1><p>{reset?t.resetText:signup?t.registerText:t.loginText}</p>
    {user?<p role="status">{t.signedIn}</p>:<>
      {!reset&&<><button type="button" className="google-button auth-google" disabled={disabled} onClick={()=>{setError("");void login();}}><span className="google-letter" aria-hidden="true">G</span>{authBusy?t.loading:t.google}</button><div className="auth-divider"><span>{t.or}</span></div></>}
      <form onSubmit={submit} className="auth-form">
        <label htmlFor="auth-email">{t.email}</label><input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={t.emailPlaceholder} value={email} onChange={e=>setEmail(e.target.value)} disabled={disabled}/>
        {!reset&&<><label htmlFor="auth-password">{t.password}</label><div className="password-field"><input id="auth-password" name="password" type={visible?"text":"password"} autoComplete={signup?"new-password":"current-password"} required minLength={signup?8:undefined} value={password} onChange={e=>setPassword(e.target.value)} disabled={disabled}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible?t.hide:t.show} aria-pressed={visible}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>{signup&&<small>{t.passwordHint}</small>}
          {signup?<><label htmlFor="auth-confirm">{t.confirm}</label><input id="auth-confirm" name="confirm-password" type={visible?"text":"password"} autoComplete="new-password" required minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} disabled={disabled}/></>:<Link className="auth-forgot" href={authHref(locale,"reset-password",next)}>{t.forgot}</Link>}</>}
        {(error||authError)&&<p className="form-error" role="alert">{error||authErrorText(authError,locale)}</p>}
        {!configured&&<p className="form-error" role="alert">{t.setup}</p>}
        {sent&&<p className="auth-success" role="status">{t.resetSent}</p>}
        <button type="submit" className="btn btn-dark auth-submit" disabled={disabled}>{authBusy?t.loading:reset?t.sendReset:signup?t.register:t.login}<ArrowRight size={18}/></button>
      </form>
      <div className="auth-switch">{reset?<Link href={authHref(locale,"login",next)}>{t.backLogin}</Link>:<>{signup?t.hasAccount:t.noAccount} <Link href={authHref(locale,signup?"login":"register",next)}>{signup?t.login:t.register}</Link></>}</div>
    </>}
  </div></section>;
}
