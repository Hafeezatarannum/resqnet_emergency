import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DashboardLayout,
  Aura,
  TopBar,
  Screen,
  GlowButton,
} from "@/components/resqnet/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/severity")({
  head: () => ({ meta: [{ title: "Severity Check — ResQNet" }] }),
  component: Severity,
});

const QUESTIONS = [
  "Is the person conscious?",
  "Is the person breathing?",
  "Is there bleeding?",
];

function Severity() {
  const [answers, setAnswers] = useState<Record<number, "yes" | "no">>({});
  return (
    <DashboardLayout>
      <Aura />
      <TopBar
        title="Quick severity check"
        subtitle="Helps responders prepare on the way"
      />
      <Screen>
        <div className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-border bg-white/[0.03] p-4"
            >
              <p className="mb-3 font-medium">{q}</p>
              <div className="flex gap-3">
                {(["yes", "no"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={cn(
                      "flex-1 rounded-[14px] border py-3 text-sm font-semibold capitalize transition",
                      answers[i] === opt
                        ? opt === "yes"
                          ? "border-success bg-success/15 text-success"
                          : "border-primary bg-primary/15 text-primary"
                        : "border-border bg-white/[0.02]",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Screen>
      <div className="relative z-10 w-full max-w-md mx-auto px-5 pb-8">
        <GlowButton to="/sos-confirm">Continue</GlowButton>
      </div>
    </DashboardLayout>
  );
}
