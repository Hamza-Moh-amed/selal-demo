import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import initTranslations from "../../i18n/i18n";
import { dir } from "i18next";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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

	await initTranslations(locale, i18nNamespaces);

	return (
		<html lang={locale} dir={dir(locale)}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
