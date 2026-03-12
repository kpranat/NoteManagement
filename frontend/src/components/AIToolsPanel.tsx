import { Sparkles, FileText, CheckCircle2, RefreshCw, Zap, Lock, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { aiService } from "@/lib/subscriptionService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AIToolsPanelProps {
  noteContent?: string;
  onResult?: (result: string, title: string) => void;
}

export default function AIToolsPanel({ noteContent = "", onResult }: AIToolsPanelProps) {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultTitle, setResultTitle] = useState<string>("");
  const [usage, setUsage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage statistics
  useEffect(() => {
    if (isPremium) {
      fetchUsage();
    }
  }, [isPremium]);

  const fetchUsage = async () => {
    try {
      const response = await aiService.getUsage();
      if (response.usage) {
        setUsage(response.usage);
      }
    } catch (err: any) {
      console.error("Failed to fetch AI usage:", err);
    }
  };

  const handlePremiumAction = async (
    action: () => Promise<any>,
    actionName: string,
    resultKey?: string
  ) => {
    if (!isPremium) {
      setError("Premium subscription required. Redirecting...");
      setTimeout(() => navigate('/subscription'), 1500);
      return;
    }

    if (!noteContent || noteContent.trim().length === 0) {
      setError("Please write some content in the note editor first.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setError(null);
    setResultTitle(actionName);
    
    try {
      const response = await action();
      
      // Extract the result based on the response structure
      let resultText = "";
      if (resultKey && response[resultKey]) {
        resultText = response[resultKey];
      } else if (response.summary) {
        resultText = response.summary;
      } else if (response.key_points) {
        resultText = response.key_points;
      } else if (response.flashcards) {
        resultText = response.flashcards;
      } else if (response.quiz) {
        resultText = response.quiz;
      } else if (response.improved) {
        resultText = response.improved;
      } else if (response.transformed) {
        resultText = response.transformed;
      } else {
        resultText = JSON.stringify(response, null, 2);
      }
      
      setResult(resultText);
      
      // Call onResult callback if provided
      if (onResult) {
        onResult(resultText, actionName);
      }
      
      // Update usage if provided in response
      if (response.usage) {
        setUsage(response.usage);
      } else {
        fetchUsage();
      }
    } catch (error: any) {
      console.log('AI Request Error:', error); // Debug log
      const errorMessage = error.error || error.message || 'Something went wrong';
      
      if (errorMessage.includes('Premium subscription required')) {
        // Only navigate if explicitly premium is required
        setError("Premium subscription required. Redirecting...");
        setTimeout(() => navigate('/subscription'), 1500);
      } else if (errorMessage.includes('Daily AI request limit reached')) {
        setError("Daily AI request limit reached. Resets tomorrow!");
        if (error.usage) {
          setUsage(error.usage);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSummary = () => {
    handlePremiumAction(
      () => aiService.summarize(noteContent),
      "AI Summary",
      "summary"
    );
  };

  const handleExtractKeyPoints = () => {
    handlePremiumAction(
      () => aiService.extractKeyPoints(noteContent),
      "Key Points",
      "key_points"
    );
  };

  const handleGenerateFlashcards = () => {
    handlePremiumAction(
      () => aiService.generateFlashcards(noteContent),
      "Flashcards",
      "flashcards"
    );
  };

  const handleGenerateQuiz = () => {
    handlePremiumAction(
      () => aiService.generateQuiz(noteContent),
      "Quiz",
      "quiz"
    );
  };

  const handleRewriteNote = () => {
    handlePremiumAction(
      () => aiService.rewriteImprove(noteContent),
      "Improved Version",
      "improved"
    );
  };

  const handleTransformNote = () => {
    handlePremiumAction(
      () => aiService.transformNote(noteContent, 'outline'),
      "Transformed Note",
      "transformed"
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
      
      {/* Usage Statistics */}
      {isPremium && usage && (
        <div className="mx-4 mt-4 p-3 bg-primary/10 text-primary rounded-lg text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Daily Usage:</span>
            <span className="font-mono">{usage.used} / {usage.limit}</span>
          </div>
          <div className="mt-2 bg-primary/20 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(usage.used / usage.limit) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-right">
            <span className="text-primary/80">{usage.remaining} remaining</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs flex items-start gap-2">
          <span className="flex-1">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="hover:opacity-70"
            aria-label="Close error message"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mx-4 mt-4 p-3 bg-secondary rounded-lg text-xs max-h-64 overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-primary">{resultTitle}</span>
            <button 
              onClick={() => setResult(null)} 
              className="hover:opacity-70"
              aria-label="Close result"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="whitespace-pre-wrap text-foreground/90">{result}</div>
        </div>
      )}

      {isProcessing && (
        <div className="mx-4 mt-4 p-3 bg-secondary rounded-lg text-xs flex items-center gap-2">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Processing with AI...
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
            disabled={isProcessing || !isPremium}
            className="dark-glow-btn w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
            Summarize Note
          </button>
          <button 
            onClick={handleExtractKeyPoints}
            disabled={isProcessing || !isPremium}
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
            disabled={isProcessing || !isPremium}
            className="dark-glow-btn dark-glow-btn-blue w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-blue-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <Zap className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
            Generate Flashcards
          </button>
          <button 
            onClick={handleGenerateQuiz}
            disabled={isProcessing || !isPremium}
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
            disabled={isProcessing || !isPremium}
            className="dark-glow-btn dark-glow-btn-purple w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-secondary rounded-lg hover:bg-purple-500 hover:text-white transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
            <RefreshCw className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
            Rewrite & Improve
          </button>
          <button 
            onClick={handleTransformNote}
            disabled={isProcessing || !isPremium}
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
            <span className="font-semibold">Premium Active</span> - {usage?.remaining || 45} AI requests remaining today!
          </div>
        ) : (
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs leading-relaxed">
            <Lock className="w-3 h-3 inline mr-1" />
            Premium features locked. 
            <button 
              onClick={() => navigate('/subscription')}
              className="block mt-1 font-semibold hover:underline"
            >
              Upgrade for AI access (45 requests/day)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
