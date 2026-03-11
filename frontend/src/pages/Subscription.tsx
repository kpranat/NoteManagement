import { CheckCircle2, Sparkles, CreditCard, Shield, Zap } from "lucide-react";

export default function Subscription() {
  const handleUpgrade = () => {
    // TODO: Connect to subscription upgrade API
    console.log("Upgrading to premium...");
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Upgrade your workspace</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Choose the right plan for your productivity needs. Unlock advanced AI features and unlimited possibilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl border-2 border-border bg-card flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Free Plan</h3>
            <p className="text-muted-foreground text-sm mb-6 h-10">Essential tools for everyday note-taking.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Up to 200 notes</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Basic note templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>100 AI actions / month</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm line-through">
                <Shield className="w-5 h-5 shrink-0" />
                <span>Advanced Search capabilities</span>
              </li>
            </ul>
          </div>
          <button className="w-full py-2.5 px-4 rounded-xl border-2 border-primary/20 bg-secondary/50 font-semibold text-primary/80 hover:bg-secondary transition-colors" disabled>
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-2xl border-2 border-primary bg-primary/5 shadow-xl shadow-primary/10 flex flex-col justify-between relative transform lg:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-primary">Premium Plan</h3>
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-6 h-10">Advanced tools and unlimited AI for power users.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">$12</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Unlimited notes</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>All premium note templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Unlimited AI tools & transformations</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Advanced search & insights dashboard</span>
              </li>
            </ul>
          </div>
          <button 
            onClick={handleUpgrade}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg focus:ring-4 focus:ring-primary/20 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
