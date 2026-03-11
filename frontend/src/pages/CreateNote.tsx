import { useNavigate } from "react-router-dom";
import { FileText, BookOpen, CheckSquare, Clock } from "lucide-react";
import { cn } from "../lib/utils";

const NOTE_TYPES = [
  {
    id: "general",
    title: "General Note",
    description: "A blank canvas for your thoughts, ideas, and drafts.",
    icon: FileText,
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    border: "hover:border-zinc-400",
  },
  {
    id: "study",
    title: "Study Note",
    description: "Structured sections with AI tools for summaries and quizzes.",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    border: "hover:border-blue-500",
  },
  {
    id: "todo",
    title: "Todo Note",
    description: "Checklists, task management, and priority indicators.",
    icon: CheckSquare,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    border: "hover:border-green-500",
  },
  {
    id: "lecture",
    title: "Lecture Note",
    description: "Timeline style layout for chronological note-taking.",
    icon: Clock,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    border: "hover:border-purple-500",
  },
];

export default function CreateNote() {
  const navigate = useNavigate();

  const handleSelect = (typeId: string) => {
    // Navigate to the editor with the selected type
    navigate(`/notes/new?type=${typeId}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Create New Note</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          What type of note do you want to create? Choose a template to get started with the right tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NOTE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={cn(
              "flex flex-col items-start p-6 rounded-2xl border-2 border-border bg-card text-left transition-all hover:bg-secondary/50 hover:shadow-md",
              type.border
            )}
          >
            <div className={cn("p-3 rounded-xl mb-4", type.color)}>
              <type.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
