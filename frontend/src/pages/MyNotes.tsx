import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, BookOpen, CheckSquare, Clock, Grid, List as ListIcon, MoreVertical, Loader2 } from "lucide-react";
import { notesService } from "../lib/notesService";
import type { Note } from "../lib/notesService";

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`;
  return date.toLocaleDateString();
};

// Helper function to extract snippet from content
const getSnippet = (content: string, maxLength: number = 100): string => {
  // Try to parse as JSON first (for structured notes)
  try {
    const parsed = JSON.parse(content);
    
    // Handle study notes
    if (parsed.subject || parsed.topic || parsed.keyConcepts) {
      const parts = [];
      if (parsed.subject) parts.push(parsed.subject);
      if (parsed.topic) parts.push(parsed.topic);
      if (parsed.keyConcepts) parts.push(parsed.keyConcepts);
      const text = parts.join(' - ');
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    // Handle todo notes (array of tasks)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
      const taskCount = parsed.length;
      const completed = parsed.filter((t: any) => t.completed).length;
      return `${completed}/${taskCount} tasks completed`;
    }
    
    // Handle lecture notes (array of segments)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].timestamp) {
      const segmentCount = parsed.length;
      return `${segmentCount} lecture ${segmentCount === 1 ? 'segment' : 'segments'}`;
    }
    
    // If JSON but unknown structure, stringify and show
    const text = JSON.stringify(parsed);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  } catch {
    // Not JSON, treat as plain text/markdown
    const plainText = content.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '').trim();
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  }
};

// Helper function to determine note type from tags
const getNoteType = (tags: string[]): string => {
  if (!tags || tags.length === 0) return "General";
  const normalizedTag = tags[0].toLowerCase();
  if (normalizedTag.includes('study')) return "Study";
  if (normalizedTag.includes('todo') || normalizedTag.includes('task')) return "Todo";
  if (normalizedTag.includes('lecture') || normalizedTag.includes('class')) return "Lecture";
  return "General";
};

export default function MyNotes() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("All");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notesService.getAllNotes();
      setNotes(response.notes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform notes to include type and snippet
  const transformedNotes = notes.map(note => ({
    ...note,
    type: getNoteType(note.tags),
    lastEdited: formatDate(note.updated_at),
    snippet: getSnippet(note.content),
  }));

  const filteredNotes = filter === "All" 
    ? transformedNotes 
    : transformedNotes.filter(n => n.type === filter);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={fetchNotes}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Notes</h1>
          <p className="text-muted-foreground">Manage and organize your knowledge base. {notes.length > 0 && `(${notes.length} ${notes.length === 1 ? 'note' : 'notes'})`}</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Filter */}
          <div className="flex bg-secondary p-1 rounded-lg">
            {["All", "General", "Study", "Todo", "Lecture"].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === type ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* View Toggles */}
          <div className="flex bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">
            {notes.length === 0 ? "No notes yet" : `No ${filter.toLowerCase()} notes found`}
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            {notes.length === 0 ? "Create your first note to get started" : "Try a different filter"}
          </p>
          {notes.length === 0 && (
            <Link
              to="/notes/new"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Create Note
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <Link 
              key={note.id} 
              to={`/notes/${note.id}`}
              className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-48"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {note.type === 'General' && <FileText className="w-4 h-4 text-muted-foreground" />}
                  {note.type === 'Study' && <BookOpen className="w-4 h-4 text-blue-500" />}
                  {note.type === 'Todo' && <CheckSquare className="w-4 h-4 text-green-500" />}
                  {note.type === 'Lecture' && <Clock className="w-4 h-4 text-purple-500" />}
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded px-1.5 uppercase tracking-wider">{note.type}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-label="More options">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">{note.title}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredNotes.map((note) => (
            <Link 
              key={note.id} 
              to={`/notes/${note.id}`}
              className="group rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  {note.type === 'General' && <FileText className="w-5 h-5 text-muted-foreground" />}
                  {note.type === 'Study' && <BookOpen className="w-5 h-5 text-blue-500" />}
                  {note.type === 'Todo' && <CheckSquare className="w-5 h-5 text-green-500" />}
                  {note.type === 'Lecture' && <Clock className="w-5 h-5 text-purple-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">{note.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block w-20 text-center">{note.type}</span>
                <button className="text-muted-foreground hover:text-foreground" aria-label="More options">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
