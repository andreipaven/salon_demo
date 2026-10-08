"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const LOCALES = ["ro", "en"];

/* Cookie-based locale switch (no URL routing). Sets the `locale` cookie and
   refreshes server components so next-intl serves the other message bundle. */
export default function LanguageSwitcher({ className = "" }) {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const change = (l) => {
    if (l === locale) return;
    document.cookie = `locale=${l};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Language">
      {LOCALES.map((l, i) => (
        <span key={l} className="ls-item">
          {i > 0 && <span className="ls-sep" aria-hidden>/</span>}
          <button
            type="button"
            className={locale === l ? "on" : ""}
            aria-pressed={locale === l}
            onClick={() => change(l)}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
