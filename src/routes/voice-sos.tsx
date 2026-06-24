import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  DashboardLayout,
  Aura,
  TopBar,
  GlowButton,
} from "@/components/resqnet/kit";
import { Mic, TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/voice-sos")({
  head: () => ({ meta: [{ title: "Voice SOS — ResQNet" }] }),
  component: VoiceSos,
});

function VoiceSos() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [debugLog, setDebugLog] = useState<string>("Initializing...");

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDebugLog("Error: Browser does not support SpeechRecognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setDebugLog("Started listening. Speak into the microphone.");
    };

    recognition.onspeechstart = () => {
      setDebugLog("Speech detected (processing...)");
    };

    recognition.onresult = (event: any) => {
      const resultsArray = Array.from(event.results);
      const text = resultsArray.map((res: any) => res[0].transcript).join(' ').toLowerCase();
      
      setTranscript(text);
      setDebugLog("Heard: " + text);

      // Trigger condition
      if (text.includes("help") || text.includes("emergency") || text.includes("resqnet")) {
        recognition.stop();
        navigate({ to: "/voice-detected" });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setDebugLog(`Error: ${event.error} (Check mic settings in Windows & Chrome)`);
    };

    recognition.onend = () => {
      setDebugLog("Listening stopped. Restarting...");
      if (window.location.pathname === "/voice-sos") {
        try { recognition.start(); } catch(e) {}
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch(e) {
      setDebugLog("Error starting recognition: " + e);
    }

    return () => {
      recognition.stop();
    };
  }, [navigate]);

  return (
    <DashboardLayout>
      <Aura />
      <TopBar title="Voice SOS" subtitle={isListening ? "Listening…" : "Initializing Mic..."} />
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative grid h-56 w-56 place-items-center">
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
          <span className="absolute inset-8 rounded-full bg-primary/20 animate-pulse-ring [animation-delay:0.8s]" />
          <span className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary to-[#b71721] glow-red animate-sos">
            <Mic className="h-14 w-14 text-white" />
          </span>
        </div>
        <h1 className="mt-10 text-2xl font-bold">Say “Help ResQNet”</h1>
        <p className="mt-2 text-sm text-muted-foreground h-10 overflow-hidden italic">
          {transcript ? `"${transcript}"` : "We’re listening for your emergency keyword…"}
        </p>

        {/* Debug Console */}
        <div className="mt-4 w-full bg-secondary/50 rounded-xl p-3 border border-border text-left">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <TerminalSquare className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">System Log</span>
          </div>
          <p className="text-xs text-foreground font-mono">{debugLog}</p>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto space-y-3 px-6 pb-10">
        <GlowButton 
          onClick={() => navigate({ to: "/voice-detected" })} 
          className="bg-brand-blue border-brand-blue/50 text-white shadow-brand-blue/20"
        >
          [Simulate "Help" Voice]
        </GlowButton>
        <GlowButton to="/voice-detected">Send SOS Manually</GlowButton>
        <GlowButton to="/home" variant="ghost">
          Cancel
        </GlowButton>
      </div>
    </DashboardLayout>
  );
}
