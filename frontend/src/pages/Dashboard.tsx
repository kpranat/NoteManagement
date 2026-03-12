import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TerminalSquare, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Sparkles,
  Zap,
  Layers,
  BarChart,
  ArrowRight
} from "lucide-react";
import { notesService } from "../lib/notesService";
import type { Note } from "../lib/notesService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [commandOpen, setCommandOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesService.getAllNotes();
      setNotes(response.notes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get note type from tags
  const getNoteType = (tags: string[]): string => {
    if (tags.includes('study')) return 'Study';
    if (tags.includes('todo')) return 'Todo';
    if (tags.includes('lecture')) return 'Lecture';
    return 'General';
  };

  // Get recent notes (limit to 4)
  const recentNotes = notes.slice(0, 4);

  // Calculate statistics
  const totalNotes = notes.length;
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const notesThisWeek = notes.filter(note => new Date(note.created_at) > oneWeekAgo).length;
  
  // Count most used type
  const typeCounts = notes.reduce((acc, note) => {
    const type = getNoteType(note.tags);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostUsedType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Format relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Section 1 - Global Command Bar */}
      <section>
        <div className="relative group max-w-3xl mx-auto">
          <TerminalSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder='Search notes or type "/" for commands'
            className="flex h-14 w-full rounded-xl border border-input shadow-sm bg-card hover:bg-secondary/50 px-4 py-3 pl-12 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all"
            onKeyDown={(e) => {
              if (e.key === '/') {
                setCommandOpen(true);
              }
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        
        {/* Placeholder for Command Menu when '/' is typed */}
        {commandOpen && (
          <div className="max-w-3xl mx-auto mt-2 p-2 relative bg-popover text-popover-foreground border rounded-lg shadow-lg">
            <div className="p-2 text-sm text-muted-foreground font-medium px-3">Create New</div>
            <button onClick={() => navigate('/notes/create?type=study')} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              <BookOpen className="w-4 h-4 text-blue-500" /> Create Study Note
            </button>
            <button onClick={() => navigate('/notes/create?type=todo')} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              <CheckSquare className="w-4 h-4 text-green-500" /> Create Todo Note
            </button>
            <button onClick={() => navigate('/notes/create?type=lecture')} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              <Clock className="w-4 h-4 text-purple-500" /> Create Lecture Note
            </button>
            <div className="my-1 h-px bg-border" />
            <div className="p-2 text-sm text-muted-foreground font-medium px-3 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500" /> AI Actions</div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              Generate AI Summary
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              Create Flashcards
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md text-left">
              Create Quiz
            </button>
          </div>
        )}
      </section>

      {/* Section 5 - Minimal Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
            <p className="text-2xl font-bold">{loading ? '...' : totalNotes}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Created This Week</p>
            <p className="text-2xl font-bold">{loading ? '...' : notesThisWeek}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BarChart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Most Used Type</p>
            <p className="text-2xl font-bold text-foreground">{loading ? '...' : mostUsedType}</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Quick Actions + Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Section 2 - Quick Actions */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/notes/create')}
              className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border border-border bg-card hover:bg-secondary/80 hover:border-primary/50 transition-all group"
            >
              <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium">New Note</span>
            </button>
            <button 
              onClick={() => navigate('/notes/create')}
              className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border border-border bg-card hover:bg-secondary/80 hover:border-blue-500/50 transition-all group"
            >
              <BookOpen className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              <span className="font-medium">Study Note</span>
            </button>
            <button 
              onClick={() => navigate('/notes/create')}
              className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border border-border bg-card hover:bg-secondary/80 hover:border-green-500/50 transition-all group"
            >
              <CheckSquare className="w-8 h-8 text-muted-foreground group-hover:text-green-500 transition-colors" />
              <span className="font-medium">Todo Note</span>
            </button>
            <button 
              onClick={() => navigate('/notes/create')}
              className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border border-border bg-card hover:bg-secondary/80 hover:border-purple-500/50 transition-all group"
            >
              <Clock className="w-8 h-8 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              <span className="font-medium">Lecture Note</span>
            </button>
          </div>
        </section>

        {/* Section 4 - Smart Suggestions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold tracking-tight">Suggestions</h2>
          </div>
          <div className="flex flex-col gap-3">
            <button className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 text-left transition-colors group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Generate quiz from DBMS Study Note</h4>
                <p className="text-xs text-muted-foreground mt-1">Test your knowledge before the exam.</p>
              </div>
            </button>
            <button className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 text-left transition-colors group">
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-500 transition-colors mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Continue Lecture Notes</h4>
                <p className="text-xs text-muted-foreground mt-1">Pick up where you left off yesterday.</p>
              </div>
            </button>
            <button className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 text-left transition-colors group">
              <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-500 transition-colors mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Review flashcards</h4>
                <p className="text-xs text-muted-foreground mt-1">You have 15 cards due for review.</p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Section 3 - Continue Working */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Continue Working
          </h2>
          <Link to="/notes" className="text-sm text-primary hover:underline underline-offset-4 flex items-center">
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Loading notes...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500">
              {error}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground mb-4">No notes yet. Create your first note!</p>
              <button 
                onClick={() => navigate('/notes/create')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Create Note
              </button>
            </div>
          ) : (
            recentNotes.map((note) => {
              const noteType = getNoteType(note.tags);
              return (
                <Link 
                  key={note.id} 
                  to={`/notes/${note.id}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between h-40"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {noteType === 'General' && <FileText className="w-4 h-4 text-muted-foreground" />}
                      {noteType === 'Study' && <BookOpen className="w-4 h-4 text-blue-500" />}
                      {noteType === 'Todo' && <CheckSquare className="w-4 h-4 text-green-500" />}
                      {noteType === 'Lecture' && <Clock className="w-4 h-4 text-purple-500" />}
                      <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded px-1.5 uppercase tracking-wider">{noteType}</span>
                    </div>
                    <h3 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">{note.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">{getRelativeTime(note.updated_at)}</p>
                </Link>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}
