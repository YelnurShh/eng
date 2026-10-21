"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { authCopy } from "@/lib/auth-i18n";
import { authHref } from "@/lib/auth-policy";
import { useLearning } from "./LearningProvider";
export default function GuestNotice({locale,next}:{locale:Locale;next?:string}){
  const {user,ready}=useLearning();const t=authCopy[locale];
  if(!ready||user)return null;
  return <div className="guest-notice" role="note"><Sparkles size={20}/><p><strong>{t.guest}</strong><span>{t.guestNotice}</span></p><Link href={authHref(locale,"login",next)}>{t.login}<span aria-hidden="true"> →</span></Link></div>;
}
export function ProfileRequired({locale}:{locale:Locale}){
  const {ready}=useLearning();const t=authCopy[locale];
  return <section className="profile-required shell"><span className="section-tag"><Sparkles size={18}/>{t.profile}</span><h1>{ready?t.profileRequired:t.loading}</h1>{ready&&<><p>{t.profileRequiredText}</p><div><Link className="btn btn-dark" href={authHref(locale)}>{t.login}</Link><Link className="secondary-button" href={authHref(locale,"register")}>{t.register}</Link></div></>}</section>;
}
