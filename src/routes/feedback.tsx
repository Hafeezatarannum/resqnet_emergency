import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout, GlowButton } from "@/components/resqnet/kit";
import { MessageSquare, ThumbsUp, Bug, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { submitFeedback, type FeedbackType } from "@/lib/api/resqnet.api";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Feedback — ResQNet" }] }),
  component: Feedback,
});

function Feedback() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    // Validation
    if (!selectedType) {
      setErrorMsg("Please select a feedback type.");
      setStatus("error");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please write a message before submitting.");
      setStatus("error");
      return;
    }
    if (!user) {
      setErrorMsg("You must be logged in to submit feedback.");
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    const { error } = await submitFeedback({
      userId: user.id,
      type: selectedType,
      message: message.trim(),
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error);
      setStatus("error");
    } else {
      setStatus("success");
      setSelectedType(null);
      setMessage("");
    }
  };

  return (
    <DashboardLayout withNav>
      <div className="max-w-[800px] mx-auto p-4 md:p-8 w-full space-y-8 pb-24">

        <div className="text-center space-y-4 py-8">
          <div className="h-20 w-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold">Send Feedback</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your feedback helps us improve ResQNet. Let us know what you think or report an issue.
          </p>
        </div>

        {/* Success State */}
        {status === "success" && (
          <div className="flex items-center gap-3 bg-success/10 border border-success/30 text-success rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="font-semibold text-sm">Thank you! Your feedback has been saved successfully.</p>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="bg-card/50 border border-border rounded-3xl p-6 md:p-8">
          <h3 className="font-semibold mb-4">What kind of feedback do you have?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => { setSelectedType('idea'); setStatus('idle'); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedType === 'idea' ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-secondary/50 border-border hover:border-brand-blue/50'}`}
            >
              <ThumbsUp className="h-6 w-6" />
              <span className="font-medium text-sm">Idea / Suggestion</span>
            </button>
            <button
              onClick={() => { setSelectedType('issue'); setStatus('idle'); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedType === 'issue' ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/50 border-border hover:border-primary/50'}`}
            >
              <Bug className="h-6 w-6" />
              <span className="font-medium text-sm">Report an Issue</span>
            </button>
            <button
              onClick={() => { setSelectedType('other'); setStatus('idle'); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedType === 'other' ? 'bg-success/10 border-success text-success' : 'bg-secondary/50 border-border hover:border-success/50'}`}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="font-medium text-sm">Other</span>
            </button>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Message</span>
              <textarea
                value={message}
                onChange={(e) => { setMessage(e.target.value); setStatus('idle'); }}
                className="w-full h-32 bg-secondary/50 border border-border rounded-xl p-4 outline-none focus:border-primary resize-none text-sm"
                placeholder="Tell us what's on your mind..."
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground text-right">{message.length}/1000</p>
            </label>
            <div className="flex justify-end pt-4">
              <GlowButton
                className="w-full sm:w-auto px-8"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Submitting...</>
                ) : (
                  "Submit Feedback"
                )}
              </GlowButton>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
