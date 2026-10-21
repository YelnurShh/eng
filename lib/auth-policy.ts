import { isLocale, isSection, type Locale } from "./i18n";
import { isAuthSection, type AuthSection } from "./auth-i18n";
import { emptyData, normaliseData, withCompletion, type LearningData } from "./progress";

export function sessionData(uid:string|null|undefined,cached?:unknown):LearningData{
  // Guest caches and legacy guest awards are never imported into an account.
  return uid?normaliseData(cached):emptyData();
}
export function awardForUser(data:LearningData,id:string,uid:string|null|undefined,now=Date.now()){
  return uid?withCompletion(data,id,now):data;
}
export function safeReturnPath(value:string|null|undefined,locale:Locale){
  const fallback=`/${locale}/profile`;
  if(!value||!value.startsWith("/")||value.startsWith("//")||value.includes("\\"))return fallback;
  try{
    const url=new URL(value,"https://internal.invalid");
    const parts=url.pathname.split("/").filter(Boolean);
    if(url.origin!=="https://internal.invalid"||parts.length>2||!isLocale(parts[0])||parts[1]&&(!isSection(parts[1])||isAuthSection(parts[1])))return fallback;
    return `/${locale}${parts[1]?`/${parts[1]}`:""}${url.search}${url.hash}`;
  }catch{return fallback;}
}
export function authHref(locale:Locale,mode:AuthSection="login",next?:string){
  return `/${locale}/${mode}?next=${encodeURIComponent(safeReturnPath(next,locale))}`;
}
