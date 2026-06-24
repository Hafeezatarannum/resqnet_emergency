import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/resqnet/kit";
import { HelpCircle, FileText, MessageSquare, Phone } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center — ResQNet" }] }),
  component: HelpCenter,
});

function HelpCenter() {
  return (
    <DashboardLayout withNav>
      <div className="max-w-[800px] mx-auto p-4 md:p-8 w-full space-y-8">
        
        <div className="text-center space-y-4 py-8">
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold">How can we help you?</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search our knowledge base or get in touch with our support team for any issues regarding ResQNet.
          </p>
          <div className="max-w-md mx-auto relative mt-6">
            <input 
              type="text" 
              placeholder="Search for articles, guides..." 
              className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/help-support" className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group">
            <FileText className="h-8 w-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Guides & FAQ</h3>
            <p className="text-sm text-muted-foreground">Learn how to use ResQNet effectively.</p>
          </Link>
          <a href="https://github.com/resqnet" target="_blank" className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group block">
            <MessageSquare className="h-8 w-8 text-brand-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Community Forum</h3>
            <p className="text-sm text-muted-foreground">Ask questions and share tips with others.</p>
          </a>
          <a href="mailto:support@resqnet.app" className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group block">
            <Phone className="h-8 w-8 text-success mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Contact Support</h3>
            <p className="text-sm text-muted-foreground">Reach our 24/7 support team directly.</p>
          </a>
        </div>

      </div>
    </DashboardLayout>
  );
}
