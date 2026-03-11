import { Sparkles, FileText, CheckCircle2, RefreshCw, Zap } from "lucide-react";

export default function AIToolsPanel() {
  const handleGenerateSummary = () => {
    // TODO: Call AI API endpoint
    console.log("Generating summary...");
  };

  const handleGenerateFlashcards = () => {
    // TODO: Call AI API endpoint
    console.log("Generating flashcards...");
  };

  const handleGenerateQuiz = () => {
    // TODO: Call AI API endpoint
    console.log("Generating quiz...");
  };

  const handleRewriteNote = () => {
    // TODO: Call AI API endpoint
    console.log("Rewriting note...");
  };

  const handleExtractKeyPoints = () => {
    // TODO: Call AI API endpoint
    console.log("Extracting key points...");
  };

  const handleTransformNote = () => {
    // TODO: Call AI API endpoint
    console.log("Transforming note...");
  };

  return (
    <div className="dark-glow-card w-80 border-l border-border dark:border-primary/10 bg-card/50 dark:bg-zinc-900/60 flex flex-col h-full sticky top-16">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Assistant
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Core Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Core Actions
          </h4>
          <button 
            onClick={handleGenerateSummary}
            className="dark-glow-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group"
          >
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            Summarize Note
          </button>
          <button 
            onClick={handleExtractKeyPoints}
            className="dark-glow-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group"
          >
            <CheckCircle2 className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            Extract Key Points
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* Study Tools */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Study Tools
          </h4>
          <button 
            onClick={handleGenerateFlashcards}
            className="dark-glow-btn dark-glow-btn-blue w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-blue-500 hover:text-white transition-all group"
          >
            <Zap className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
            Generate Flashcards
          </button>
          <button 
            onClick={handleGenerateQuiz}
            className="dark-glow-btn dark-glow-btn-blue w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-blue-500 hover:text-white transition-all group"
          >
            <CheckCircle2 className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
            Generate Quiz
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* Revisions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Revisions
          </h4>
          <button 
            onClick={handleRewriteNote}
            className="dark-glow-btn dark-glow-btn-purple w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-purple-500 hover:text-white transition-all group"
          >
            <RefreshCw className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
            Rewrite & Improve
          </button>
          <button 
            onClick={handleTransformNote}
            className="dark-glow-btn dark-glow-btn-purple w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-purple-500 hover:text-white transition-all group"
          >
            <Sparkles className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
            Transform Note
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="p-3 bg-primary/10 text-primary rounded-lg text-xs leading-relaxed">
          AI limits: <span className="font-semibold">45 / 100</span> requests remaining this week. 
          <a href="/subscription" className="block mt-1 font-semibold hover:underline">Upgrade for unlimited</a>
        </div>
      </div>
    </div>
  );
}
