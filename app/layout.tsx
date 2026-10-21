import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "./globals.css";
import LearningProvider from "@/components/LearningProvider";

export const metadata: Metadata = {
  title: "Speak Without Fear — Әбдиева Гүлмира",
  description: "Оқушыларға ағылшынша сенімді сөйлеуге көмектесетін интерактивті мектеп жобасы.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kk" data-scroll-behavior="smooth">
      <body><LearningProvider>{children}</LearningProvider></body>
    </html>
  );
}
