import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DashboardLayout,
  GlowButton,
  Logo,
  Wordmark,
} from "@/components/resqnet/kit";
import {
  ShieldAlert,
  Activity,
  MapPin,
  Users,
  HeartPulse,
  Clock,
  ChevronRight,
  ShieldCheck,
  Bot,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "ResQNet — Emergency Platform" }] }),
  component: Landing,
});

function Landing() {
  return (
    <DashboardLayout>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-background text-foreground scroll-smooth">
        
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <Wordmark className="text-xl" />
          </div>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              Login
            </Link>
            <GlowButton
              to="/signup"
              variant="primary"
              className="h-9 px-4 text-sm"
            >
              Get Started
            </GlowButton>
          </div>
        </header>

        {/* HERO SECTION */}
        <section id="home" className="relative flex flex-col items-center justify-center pt-16 pb-12 px-6 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[150px]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live: 24 active emergencies in your region
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Help Arrives When <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Seconds Matter.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The world's most advanced emergency response platform. Instantly connect with nearby responders, hospitals, and family members with a single tap.
            </p>

            <div className="flex justify-center pt-4 gap-4 flex-col sm:flex-row items-center w-full max-w-sm mx-auto sm:max-w-none">
              <GlowButton to="/login" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-primary/25">
                Login
              </GlowButton>
              <a href="/resqnet.apk" download className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 h-14 text-base font-bold text-foreground hover:bg-secondary/50 transition-colors w-full sm:w-auto">
                <Download className="w-5 h-5" /> Download APK
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section
          id="features"
          className="py-12 px-6 border-t border-border/50 relative"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Enterprise-Grade Protection
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to stay safe, packed into a blazing fast platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "One-tap SOS",
                  icon: ShieldAlert,
                  desc: "Instantly alert authorities and emergency contacts with precise location.",
                },
                {
                  title: "Live Tracking",
                  icon: MapPin,
                  desc: "Real-time GPS tracking for responders and family members.",
                },
                {
                  title: "AI Emergency Assistant",
                  icon: Bot,
                  desc: "Voice-activated AI guides you through first aid and crisis management.",
                },
                {
                  title: "Smartwatch Integration",
                  icon: Activity,
                  desc: "Automatic fall detection and pulse monitoring directly from your wrist.",
                },
                {
                  title: "Emergency Contacts",
                  icon: Users,
                  desc: "Tiered alerting system ensures someone always answers the call.",
                },
                {
                  title: "Medical Profile",
                  icon: HeartPulse,
                  desc: "Securely share critical health data like blood type and allergies with EMTs.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (HORIZONTAL TIMELINE) */}
        <section id="how-it-works" className="py-12 px-6 bg-secondary/30 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground">
                Three simple steps to immediate assistance.
              </p>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-start gap-10 md:gap-4">
              {/* Line connector */}
              <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-border z-0">
                <div className="h-full bg-primary w-full animate-pulse opacity-50" />
              </div>

              {[
                {
                  num: "01",
                  title: "Trigger SOS",
                  desc: "Press the button or use voice command. We grab your exact coordinates.",
                  icon: ShieldAlert,
                },
                {
                  num: "02",
                  title: "AI Detects & Routes",
                  desc: "Our AI analyzes the situation and immediately alerts the closest responders.",
                  icon: Bot,
                },
                {
                  num: "03",
                  title: "Help Arrives",
                  desc: "Track responders in real-time on the map as they navigate to your location.",
                  icon: Clock,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center text-center flex-1 w-full"
                >
                  <div className="h-16 w-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,59,59,0.3)]">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-primary text-sm font-bold mb-2 tracking-widest uppercase">
                    STEP {step.num}
                  </h4>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE STATISTICS */}
        <section id="about" className="py-12 px-6 border-t border-border/50">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "SOS Sent", value: "1.2M+" },
              { label: "Lives Assisted", value: "450K+" },
              { label: "Active Responders", value: "85K" },
              { label: "Avg Response Time", value: "4.2 Min" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-muted-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-12 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Millions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "ResQNet saved my life during a hiking accident. The GPS tracking was spot on and EMTs found me in 15 minutes.",
                  author: "Sarah Jenkins",
                  role: "Verified User",
                },
                {
                  quote:
                    "As a volunteer responder, this app gives me all the critical info I need before I even arrive on scene. Highly recommended.",
                  author: "Dr. Arvind Patel",
                  role: "Medical Professional",
                },
                {
                  quote:
                    "The peace of mind knowing my elderly parents have this on their smartwatch is invaluable.",
                  author: "Michael Chang",
                  role: "Family Member",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-2xl p-6"
                >
                  <div className="flex text-warning mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                      {t.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{t.author}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="contact" className="py-12 px-6 border-t border-border/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Is ResQNet free to use?", a: "Yes, basic SOS and tracking features are completely free. We also offer premium features for advanced integrations." },
                { q: "Does it work internationally?", a: "ResQNet operates globally but response times depend on local emergency infrastructure integration." },
                { q: "How is my medical data stored?", a: "Your medical profile is encrypted end-to-end and only shared with verified responders during an active emergency." }
              ].map((faq, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border bg-secondary/10 py-12 px-6 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Logo size={24} />
              <Wordmark className="text-lg" />
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ResQNet Technologies. All rights
              reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
