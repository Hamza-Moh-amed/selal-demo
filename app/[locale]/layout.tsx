import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { dir } from "i18next";
import initTranslations from "../../i18n/i18n";
import TranslationsProvider from "@/i18n/TranslationProvider";
import { Inter } from "next/font/google";
import MobileNav from "@/components/Layout/MobileNav";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Selal",
  description: "Selal",
};

const i18nNamespaces = ["translation"];

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const { children } = props;

  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className={`${inter.variable} `}>
        <MobileNav />
        <div className="pt-14 lg:pt-0">
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            {children}
          </TranslationsProvider>
        </div>
      </body>
    </html>
  );
}
