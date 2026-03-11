import { BarChart, Activity, FileText, Sparkles, TrendingUp } from "lucide-react";

export default function Insights() {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Insights</h1>
        <p className="text-muted-foreground text-lg">
          Track your note-taking habits and workspace productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium uppercase tracking-wider text-xs">
            <FileText className="w-4 h-4" />
            Total Notes
          </div>
          <p className="text-4xl font-bold">124</p>
          <div className="mt-4 flex items-center gap-1 text-sm text-green-500 font-medium">
            <TrendingUp className="w-4 h-4" />
            +12% this month
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium uppercase tracking-wider text-xs">
            <Activity className="w-4 h-4" />
            Active Days
          </div>
          <p className="text-4xl font-bold">18</p>
          <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground font-medium">
            In the last 30 days
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium uppercase tracking-wider text-xs">
            <Sparkles className="w-4 h-4" />
            AI Actions Used
          </div>
          <p className="text-4xl font-bold">45</p>
          <div className="mt-4 flex items-center gap-1 text-sm text-amber-500 font-medium">
            55 remaining
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-4 font-medium uppercase tracking-wider text-xs">
            <BarChart className="w-4 h-4" />
            Favorite Type
          </div>
          <p className="text-4xl font-bold">Study</p>
          <div className="mt-4 flex items-center gap-1 text-sm text-blue-500 font-medium">
            40% of all notes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border rounded-xl p-6 bg-card">
          <h3 className="font-semibold mb-6 flex items-center gap-2">Notes Created (Last 7 Days)</h3>
          {/* Mock Chart Area */}
          <div className="h-48 flex items-end gap-2 justify-between">
            {[10, 30, 15, 45, 20, 55, 30].map((h, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary transition-colors group relative" style={{ height: `${h}%` }}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground border-t border-border pt-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          {/* // TODO: Fetch analytics from backend  */}
        </div>

        <div className="border border-border rounded-xl p-6 bg-card flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <BarChart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-2">More charts coming soon</h3>
          <p className="text-sm text-muted-foreground max-w-[200px]">
             We're working on advanced productivity metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
