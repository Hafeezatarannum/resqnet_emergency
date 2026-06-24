import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
  Wordmark,
} from "@/components/resqnet/kit";
import { LANGUAGES } from "@/lib/resqnet-data";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { LanguageCode } from "@/lib/translations";

export const Route = createFileRoute("/language")({
  head: () => ({ meta: [{ title: "Choose Language — ResQNet" }] }),
  component: Language,
});

function Language() {
  const { lang, setLang, t } = useTranslation();
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title={t("lang.title")}
        subtitle={t("lang.subtitle")}
        right={<Globe className="h-5 w-5 text-muted-foreground" />}
      />
      <Screen>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Wordmark className="text-base" /> {t("lang.speaks")}
        </div>
        <div className="space-y-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code as LanguageCode)}
              className={cn(
                "flex w-full items-center justify-between rounded-[18px] border p-4 text-left transition",
                lang === l.code
                  ? "border-primary bg-primary/10"
                  : "border-border bg-white/[0.03]",
              )}
            >
              <div>
                <p className="font-semibold">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.native}</p>
              </div>
              {lang === l.code && (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          ))}
        </div>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8 pt-2">
        <GlowButton to="/login">{t("general.continue")}</GlowButton>
      </div>
    </DashboardLayout>
  );
}
