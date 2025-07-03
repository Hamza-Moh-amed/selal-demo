import LanguageChanger from "@/i18n/LanguageChanger";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-white">
      <main className="flex flex-col gap-10 w-full max-w-lg items-center">
        <h1 className="text-4xl font-bold text-center">Selal</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
          <Link
            className="border border-gray-300 rounded-md px-6 py-3 w-full sm:w-auto flex-1 text-center font-light text-base transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            href="/sign-in"
            tabIndex={0}
            aria-label="Sign In"
          >
            Sign In
          </Link>
          <Link
            className="border border-gray-300 rounded-md px-6 py-3 w-full sm:w-auto flex-1 text-center font-light text-base transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            href="/sign-up"
            tabIndex={0}
            aria-label="Sign Up"
          >
            Sign Up
          </Link>
          <Link
            className="border border-gray-300 rounded-md px-6 py-3 w-full sm:w-auto flex-1 text-center font-light text-base transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            href="/dashboard"
            tabIndex={0}
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
        </div>
        <div className="mt-8 flex justify-center w-full">
          <LanguageChanger />
        </div>
      </main>
    </div>
  );
}
