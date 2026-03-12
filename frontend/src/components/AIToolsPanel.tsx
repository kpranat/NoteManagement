import { Sparkles, FileText, CheckCircle2, RefreshCw, Zap, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { aiService } from "@/lib/subscriptionService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AIToolsPanel() {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handlePremiumAction = async (action: () => Promise<any>, actionName: string) => {
    if (!isPremium) {
      navigate('/subscription');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    
    try {
      const response = await action();
      setResult(`${actionName} completed successfully!`);
      console.log(`${actionName} result:`, response);
    } catch (error: any) {
      if (error.error?.includes('Premium subscription required')) {
        navigate('/subscription');
      } else {
        setResult(`Error: ${error.error || 'Something went wrong'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSummary = () => {
    handlePremiumAction(
      () => aiService.summarize("Sample note content to summarize"),
      "Summarization"
    );
  };

  const handleExtractKeyPoints = () => {
    handlePremiumAction(
      () => aiService.enhance("Sample note content to enhance"),
      "Key Points Extraction"
    );
  };

  const handleGenerateFlashcards = () => {
    handlePremiumAction(
      () => aiService.suggestTags("Sample note content for tags"),
      "Flashcard Generation"
    );
  };

  const handleGenerateQuiz = () => {
    handlePremiumAction(
      () => aiService.analyzeSentiment("Sample note content for analysis"),
      "Quiz Generation"
    );
  };

  const handleRewriteNote = () => {
    handlePremiumAction(
      () => aiService.enhance("Sample note content to rewrite"),
      "Note Rewriting"
    );
  };

  const handleTransformNote = () => {
    handlePremiumAction(
      () => aiService.enhance("Sample note content to transform"),
      "Note Transformation"
    );
  };

  return (
    <div className="dark-glow-card w-80 border-l border-border dark:border-primary/10 bg-card/50 dark:bg-zinc-900/60 flex flex-col h-full sticky top-16">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Assistant
          {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
        </h3>
      </div>
      
      {/* Result Display */}
      {result && (
        <div className="mx-4 mt-4 p-3 bg-primary/10 text-primary rounded-lg text-xs">
          {result}
        </div>
      )}

      {isProcessing && (
        <div className="mx-4 mt-4 p-3 bg-secondary rounded-lg text-xs flex items-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Processing...
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Core Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Core Actions
          </h4>
          <button 
            onClick={handleGenerateSummary}
            disabled={isProcessing}
            className="dark-glow-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            Summarize Note
          </button>
          <button 
            onClick={handleExtractKeyPoints}
            disabled={isProcessing}
            className="dark-glow-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
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
            disabled={isProcessing}
            className="dark-glow-btn dark-glow-btn-blue w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-blue-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <Zap className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
            Generate Flashcards
          </button>
          <button 
            onClick={handleGenerateQuiz}
            disabled={isProcessing}
            className="dark-glow-btn dark-glow-btn-blue w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-blue-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
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
            disabled={isProcessing}
            className="dark-glow-btn dark-glow-btn-purple w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-purple-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <RefreshCw className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
            Rewrite & Improve
          </button>
          <button 
            onClick={handleTransformNote}
            disabled={isProcessing}
            className="dark-glow-btn dark-glow-btn-purple w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-purple-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <Sparkles className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
            Transform Note
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        {isPremium ? (
          <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs leading-relaxed">
            <span className="font-semibold">Premium Active</span> - Unlimited AI requests available!
          </div>
        ) : (
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs leading-relaxed">
            <Lock className="w-3 h-3 inline mr-1" />
            Premium features locked. 
            <button 
              onClick={() => navigate('/subscription')}
              className="block mt-1 font-semibold hover:underline"
            >
              Upgrade for unlimited access
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
