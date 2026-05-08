import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AanmeldenForm from "./AanmeldenForm";

export const metadata = {
  title: "Café aanmelden — WK 2026 Spotter",
};

export default function AanmeldenPage() {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Café aanmelden</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Zet jouw kroeg op de WK 2026 kaart
            </p>
          </div>
          <span className="ml-auto text-2xl">🇳🇱</span>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Uitleg banner */}
        <div className="mb-6 rounded-2xl bg-orange-50 p-4 dark:bg-orange-900/20">
          <p className="text-sm text-orange-800 dark:text-orange-300">
            <strong>Kroegbazen welkom!</strong> Vul hieronder je gegevens in. Na het indienen
            verschijnt je café direct op de kaart voor alle WK-kijkers in de buurt.
          </p>
        </div>

        <AanmeldenForm />
      </div>
    </div>
  );
}
