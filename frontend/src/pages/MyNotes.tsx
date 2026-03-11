import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, BookOpen, CheckSquare, Clock, Grid, List as ListIcon, MoreVertical } from "lucide-react";

const ALL_NOTES = [
  { id: 1, title: "Product Requirements Q3", type: "General", lastEdited: "2 hours ago", snippet: "Key deliverables for the upcoming quarter include..." },
  { id: 2, title: "DBMS Study Guide", type: "Study", lastEdited: "Yesterday", snippet: "Relational algebra, normal forms (1NF, 2NF, 3NF, BCNF)..." },
  { id: 3, title: "Weekly Planning and Goals", type: "Todo", lastEdited: "Yesterday", snippet: "1. Finish frontend UI. 2. Setup backend auth..." },
  { id: 4, title: "Physics 101: Thermodynamics", type: "Lecture", lastEdited: "2 days ago", snippet: "Zeroth law of thermodynamics defines temperature..." },
  { id: 5, title: "Meeting with Design Team", type: "General", lastEdited: "Last week", snippet: "Discussed the new Arc-like sidebar and command palette." },
  { id: 6, title: "Linear Algebra Midterm Prep", type: "Study", lastEdited: "Last week", snippet: "Eigenvalues, eigenvectors, singular value decomposition." },
];

export default function MyNotes() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("All");

  const filteredNotes = filter === "All" ? ALL_NOTES : ALL_NOTES.filter(n => n.type === filter);

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Notes</h1>
          <p className="text-muted-foreground">Manage and organize your knowledge base.</p>
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
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
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
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">{note.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{note.snippet}</p>
              <p className="text-xs text-muted-foreground mt-4 shrink-0">{note.lastEdited}</p>
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
                  <p className="text-sm text-muted-foreground truncate">{note.snippet}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block w-20 text-center">{note.type}</span>
                <span className="text-xs text-muted-foreground w-24 text-right hidden md:inline-block">{note.lastEdited}</span>
                <button className="text-muted-foreground hover:text-foreground">
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
