import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { 
  Save, 
  Trash2, 
  Heading1, 
  ListTodo, 
  Clock, 
  BookOpen, 
  Sparkles,
  Zap,
  Check,
  Loader2,
  Copy
} from "lucide-react";
import AIToolsPanel from "../components/AIToolsPanel";
import { notesService } from "../lib/notesService";

export default function NoteEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: noteId } = useParams();
  
  const typeParam = searchParams.get("type");
  const [noteType, setNoteType] = useState(typeParam || "general");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Output state
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiResultTitle, setAiResultTitle] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Study Note specifics
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [keyConcepts, setKeyConcepts] = useState("");
  const [detailedExplanation, setDetailedExplanation] = useState("");

  // Todo Note specifics
  const [tasks, setTasks] = useState([{ id: 1, text: "First task", completed: false, priority: "normal" }]);

  // Lecture Note specifics
  const [segments, setSegments] = useState([{ id: 1, timestamp: "00:00", text: "Introduction" }]);
  // Fetch note data if editing existing note
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await notesService.getNoteById(noteId);
        const note = response.note;

        setTitle(note.title);

        // Determine note type from tags
        const type = note.tags[0]?.toLowerCase() || "general";
        setNoteType(type);

        // Parse content based on note type
        try {
          const parsedContent = JSON.parse(note.content);

          if (type === "study") {
            setSubject(parsedContent.subject || "");
            setTopic(parsedContent.topic || "");
            setKeyConcepts(parsedContent.keyConcepts || "");
            setDetailedExplanation(parsedContent.detailedExplanation || "");
          } else if (type === "todo") {
            setTasks(parsedContent);
          } else if (type === "lecture") {
            setSegments(parsedContent);
          } else {
            // General note or unknown structure
            setContent(note.content);
          }
        } catch {
          // Not JSON, treat as plain text
          setContent(note.content);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load note");
        console.error("Error loading note:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);
  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Prepare content based on note type
      let noteContent = "";
      const tags = [noteType];

      switch (noteType) {
        case "study":
          noteContent = JSON.stringify({
            subject,
            topic,
            keyConcepts,
            detailedExplanation,
          });
          break;
        case "todo":
          noteContent = JSON.stringify(tasks);
          break;
        case "lecture":
          noteContent = JSON.stringify(segments);
          break;
        default:
          noteContent = content;
      }

      // Create or update note
      if (noteId) {
        // Update existing note
        await notesService.updateNote(noteId, {
          title: title.trim(),
          content: noteContent,
          tags: tags,
        });
      } else {
        // Create new note
        await notesService.createNote({
          title: title.trim(),
          content: noteContent,
          tags: tags,
        });
      }

      // Navigate back to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
      console.error("Error saving note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) {
      // For new notes, just go back
      navigate("/dashboard");
      return;
    }

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await notesService.deleteNote(noteId);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  const handleAiResult = (result: string, title: string) => {
    setAiResult(result);
    setAiResultTitle(title);
    // Scroll to AI output section
    setTimeout(() => {
      document.getElementById('ai-output')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const copyAiResult = async () => {
    if (!aiResult) return;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(aiResult);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = aiResult;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      // Show success feedback
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy text. Please try selecting and copying manually.');
    }
  };

  const renderEditorContent = () => {
    switch (noteType) {
      case "study":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                  placeholder="e.g. Database Systems"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Topic</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                  placeholder="e.g. Normalization"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                Key Concepts
                <button className="text-primary hover:bg-primary/10 px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-extract
                </button>
              </label>
              <textarea
                className="w-full min-h-[100px] bg-secondary/30 rounded-lg border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none p-4 resize-y"
                placeholder="List the main ideas here..."
                value={keyConcepts}
                onChange={(e) => setKeyConcepts(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Detailed Explanation</label>
              <textarea
                className="w-full min-h-[200px] bg-secondary/30 rounded-lg border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none p-4 resize-y"
                placeholder="Expand on the concepts..."
                value={detailedExplanation}
                onChange={(e) => setDetailedExplanation(e.target.value)}
              />
            </div>
          </div>
        );
      
      case "todo":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold tracking-tight text-lg">Action Items</h3>
              <button 
                onClick={() => setTasks([...tasks, { id: Date.now(), text: "", completed: false, priority: "normal" }])}
                className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium"
              >
                + Add Task
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg group hover:border-border/80 transition-all">
                  <div className="mt-1">
                    <button 
                      className={`w-5 h-5 rounded flex items-center justify-center border ${task.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-input hover:border-primary'}`}
                      onClick={() => {
                        const newTasks = [...tasks];
                        newTasks[index].completed = !newTasks[index].completed;
                        setTasks(newTasks);
                      }}
                    >
                      {task.completed && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    className={`flex-1 bg-transparent outline-none ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    value={task.text}
                    onChange={(e) => {
                      const newTasks = [...tasks];
                      newTasks[index].text = e.target.value;
                      setTasks(newTasks);
                    }}
                    placeholder="What needs to be done?"
                  />
                  <select 
                    className="text-xs bg-secondary/50 border border-transparent hover:border-border rounded px-2 py-1 outline-none text-muted-foreground"
                    value={task.priority}
                    onChange={(e) => {
                      const newTasks = [...tasks];
                      newTasks[index].priority = e.target.value;
                      setTasks(newTasks);
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "lecture":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold tracking-tight text-lg">Timeline</h3>
              <button 
                onClick={() => setSegments([...segments, { id: Date.now(), timestamp: "00:00", text: "" }])}
                className="text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md font-medium"
              >
                + Add Segment
              </button>
            </div>
            <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {segments.map((segment, index) => (
                <div key={segment.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -mb-0.5" />
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] flex items-start flex-col pl-6 md:pl-0 md:group-odd:pr-6 md:group-even:pl-6">
                    <div className="flex items-center gap-2 mb-2 w-full">
                      <input 
                        type="text" 
                        className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded text-primary w-16 text-center outline-none border border-transparent focus:border-border"
                        value={segment.timestamp}
                        onChange={(e) => {
                          const newSegs = [...segments];
                          newSegs[index].timestamp = e.target.value;
                          setSegments(newSegs);
                        }}
                      />
                    </div>
                    <textarea 
                      className="w-full min-h-[80px] bg-card border border-border rounded-lg p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none shadow-sm"
                      placeholder="Lecture notes here..."
                      value={segment.text}
                      onChange={(e) => {
                        const newSegs = [...segments];
                        newSegs[index].text = e.target.value;
                        setSegments(newSegs);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "general":
      default:
        return (
          <div className="relative font-sans h-full">
            <textarea
              className="w-full h-full min-h-[500px] bg-transparent outline-none resize-none text-lg leading-relaxed text-foreground dark:text-zinc-100 placeholder:text-muted-foreground/50 dark:placeholder:text-zinc-500"
              placeholder='Start typing here... or press "/" for commands'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === '/') {
                  setCommandOpen(true);
                  // Ensure it doesn't double input if handled elsewhere, but keeping simple for UI demo
                }
              }}
            />
            
            {/* Slash Command Menu Overlay (simulated position) */}
            {commandOpen && (
              <div className="absolute top-10 left-10 w-64 bg-popover text-popover-foreground border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Basic blocks</div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left" onClick={() => setCommandOpen(false)}>
                  <Heading1 className="w-4 h-4" /> Heading
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left" onClick={() => setCommandOpen(false)}>
                  <ListTodo className="w-4 h-4" /> Checklist
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left" onClick={() => setCommandOpen(false)}>
                  <Clock className="w-4 h-4" /> Timestamp
                </button>
                <div className="h-px bg-border my-1" />
                <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> AI Tools
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left" onClick={() => setCommandOpen(false)}>
                  <BookOpen className="w-4 h-4 text-primary" /> Generate AI Summary
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted text-left" onClick={() => setCommandOpen(false)}>
                  <Zap className="w-4 h-4 text-blue-500" /> Generate Flashcards
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  // Show loading state while fetching note
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem-2rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem-2rem)] shrink-0 gap-6 animate-in fade-in duration-300">
      {/* Note Editor Card */}
      <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full">
        {/* Frosted glass card with glow */}
        <div className="note-editor-card flex-1 flex flex-col rounded-2xl shadow-xl shadow-primary/5 ring-1 ring-primary/10 dark:ring-primary/20 overflow-hidden">

          {/* Editor Toolbar & Header */}
          <div className="note-editor-header flex items-start justify-between px-8 py-6 border-b border-border/50 sticky top-0 z-10 rounded-t-2xl">
            <div className="w-full max-w-2xl">
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                {noteType} Note
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full text-4xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/40 mt-1 focus:placeholder:text-muted-foreground/20 transition-colors"
              />
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 ml-4 pt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                  title="Delete note"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            {renderEditorContent()}
          </div>

          {/* AI Output Section */}
          {aiResult && (
            <div id="ai-output" className="border-t border-border/50 px-8 py-6 bg-secondary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{aiResultTitle}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAiResult}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                      copySuccess 
                        ? 'bg-green-600 text-white' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setAiResult(null)}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {aiResult}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>


      {/* AI Tools Panel (Right Sidebar) */}
      <div className="hidden lg:block">
        <AIToolsPanel 
          noteContent={(() => {
            // Get content based on note type for AI processing
            switch (noteType) {
              case "study":
                return `Subject: ${subject}\nTopic: ${topic}\n\nKey Concepts:\n${keyConcepts}\n\nDetailed Explanation:\n${detailedExplanation}`;
              case "todo":
                return tasks.map((task, idx) => `${idx + 1}. [${task.completed ? 'x' : ' '}] ${task.text} (Priority: ${task.priority})`).join('\n');
              case "lecture":
                return segments.map(seg => `[${seg.timestamp}] ${seg.text}`).join('\n\n');
              default:
                return content;
            }
          })()} 
          onResult={handleAiResult}
        />
      </div>

    </div>
  );
}
