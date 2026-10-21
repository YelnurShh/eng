"use client";

import { Cloud, CloudOff, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { authErrorText } from "@/lib/auth-i18n";
import { platform } from "@/lib/platform-i18n";
import { useLearning } from "./LearningProvider";

export function SyncIndicator({locale}:{locale:Locale}){
  const {sync,user,storageAvailable,retry}=useLearning();const p=platform[locale];
  const text=!storageAvailable&&!user?(locale==="kk"?"Браузер жадын қолдану мүмкін емес. Прогресс парақ жабылғанда жоғалады.":locale==="ru"?"Хранилище браузера недоступно. Прогресс не сохранится после закрытия.":"Browser storage is unavailable. Progress will be lost when the page closes."):sync==="error"?p.syncError:sync==="saved"?p.saved:sync==="saving"||sync==="loading"?p.saving:p.local;
  return <div className={`sync-indicator sync-${sync}`} role="status">{sync==="error"?<CloudOff size={16}/>:sync==="saving"||sync==="loading"?<RefreshCw size={16}/>:<Cloud size={16}/>}<span>{text}</span>{sync==="error"&&user&&<button onClick={retry}>{p.retry}</button>}</div>;
}
export default function AccountPanel({locale}:{locale:Locale}){
  const {user,authBusy,authError,logout}=useLearning();const p=platform[locale];
  if(!user)return null;
  return <div className="account-panel"><div className="account-panel-copy"><span className="account-shield"><ShieldCheck size={23}/></span><div><strong>{user.displayName||p.profile}</strong><p>{user.email}</p></div></div><button className="secondary-button" disabled={authBusy} onClick={logout}><LogOut size={17}/>{authBusy?p.loading:p.logout}</button>{authError&&<p className="form-error" role="alert">{authErrorText(authError,locale)}</p>}<SyncIndicator locale={locale}/></div>;
}
