import Link from "next/link";
import { ArrowRight, BookOpenCheck, ChartNoAxesCombined, Gamepad2, MessageCircleMore, Sparkles } from "lucide-react";
import { content, type Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-i18n";
import SiteShell from "./SiteShell";
import HeroPlayground from "./HeroPlayground";

export default function HomePage({ locale }: { locale: Locale }) {
  const t = content[locale];const p=platform[locale];
  const cards = [
    { icon: <Gamepad2 size={27} />, title:p.wordGame, text:p.wordGameText, href:`/${locale}/games`, className:"card-blue" },
    { icon: <MessageCircleMore size={27} />, title:t.nav.speaking, text:p.speakGoal, href:`/${locale}/speaking-room`, className:"card-yellow" },
    { icon: <ChartNoAxesCombined size={27} />, title:p.profile, text:p.profileText, href:`/${locale}/profile`, className:"card-pink" },
  ];
  return <SiteShell locale={locale}><main>
    <section className="school-hero"><div className="shell school-hero-grid"><div className="hero-text"><span className="eyebrow"><span className="live-dot"/>{p.heroTag}</span><h1><span className="quote-line quote-one">{p.heroFirst}</span><span className="quote-line quote-two">{p.heroSecond}</span></h1><p>{p.heroLead}</p><div className="hero-buttons"><Link href={`/${locale}/games`} className="primary-button">{p.heroCta}<ArrowRight size={19}/></Link><a href="#about" className="secondary-button">{p.heroSecondary}</a></div><span className="hero-note">{p.heroNote}</span></div><HeroPlayground locale={locale}/></div></section>
    <section id="about" className="home-about"><div className="shell"><div className="section-intro"><span className="eyebrow"><Sparkles size={15}/>{t.home.introTag}</span><h2>{p.homeGames}</h2><p>{p.homeGamesText}</p></div><div className="home-card-grid">{cards.map(card=><Link href={card.href} className={`home-card ${card.className}`} key={card.href}><span className="home-card-icon">{card.icon}</span><h3>{card.title}</h3><p>{card.text}</p><span className="card-arrow"><ArrowRight size={20}/></span></Link>)}</div></div></section>
    <section className="home-path"><div className="shell home-path-grid"><div><span className="eyebrow"><BookOpenCheck size={16}/>{t.home.pathTag}</span><h2>{t.home.pathTitle}</h2><p>{t.home.introText}</p><Link href={`/${locale}/test`} className="text-link">{t.home.cardOneTitle}<ArrowRight size={18}/></Link></div><div className="path-steps">{t.home.pathSteps.map((step,index)=><div key={step}><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong><ArrowRight size={19}/></div>)}</div></div></section>
    <section className="home-bottom"><div className="shell"><span className="bottom-spark"><Sparkles size={29}/></span><h2>{t.home.bottomTitle}</h2><p>{t.home.bottomText}</p><Link href={`/${locale}/challenge`} className="primary-button">{t.home.bottomButton}<ArrowRight size={19}/></Link></div></section>
  </main></SiteShell>;
}
