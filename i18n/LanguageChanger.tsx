"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "@/i18nConfig";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
			<path d="M2 12h20" />
		</svg>
	);
}

export default function LanguageChanger({
	buttonClass,
}: {
	buttonClass?: string;
}) {
	const { i18n } = useTranslation();
	const currentLocale = i18n.language;
	const router = useRouter();
	const currentPathname = usePathname();

	const handleLanguageSelect = (newLocale: string) => {
		// set cookie for next-i18n-router
		const days = 30;
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		const expires = date.toUTCString();
		document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

		// redirect to the new locale path
		if (
			currentLocale === i18nConfig.defaultLocale &&
			!i18nConfig.prefixDefault
		) {
			router.push("/" + newLocale + currentPathname);
		} else {
			router.push(
				currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
			);
		}

		router.refresh();
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						className={`flex items-center gap-2 px-2 py-2 rounded-md border border-primary-500 ${buttonClass}`}
					>
						<GlobeIcon className="h-5 w-5 text-primary-500" />
						<span className="text-secondary-100">
							{currentLocale === "ar" ? "العربية" : "English"}
						</span>
						{/* <ChevronDownIcon className="h-4 w-4" /> */}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48 bg-white">
					<DropdownMenuItem
						className="flex items-center justify-between cursor-pointer"
						onClick={() => handleLanguageSelect("en")}
					>
						<span>English</span>
						{currentLocale === "en" && <CheckIcon className="h-5 w-5" />}
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => handleLanguageSelect("ar")}
					>
						<span>العربية</span>
						{currentLocale === "ar" && <CheckIcon className="h-5 w-5" />}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* <select onChange={handleChange} value={currentLocale} className="bg-none">
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select> */}
		</>
	);
}
