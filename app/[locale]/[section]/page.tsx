import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Experience from "@/components/Experience";
import { authCopy } from "@/lib/auth-i18n";
import { platform } from "@/lib/platform-i18n";
import { content, isLocale, isSection, locales, sectionSlugs, type Locale, type SectionSlug } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) => sectionSlugs.map((section) => ({ locale, section })));
}

function title(locale: Locale, section: SectionSlug) {
  const nav = content[locale].nav;
  return ({ test: nav.test, cycle: nav.cycle, challenge: nav.challenge, "speaking-room": nav.speaking, progress: nav.progress, "fear-wall": nav.wall, mirror: nav.mirror, games: platform[locale].games, profile: platform[locale].profile, login: authCopy[locale].login, register: authCopy[locale].register, "reset-password": authCopy[locale].reset })[section];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }): Promise<Metadata> {
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSection(section)) return {};
  return { title: `${title(locale, section)} — Speak Without Fear` };
}

export default async function SectionPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section } = await params;
  if (!isLocale(locale) || !isSection(section)) notFound();
  return <Experience locale={locale} section={section} />;
}
