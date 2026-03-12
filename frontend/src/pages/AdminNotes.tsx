import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import {
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  User,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  user_email?: string;
  user_name?: string;
}

export default function AdminNotes() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchAllNotes();
  }, [isAdmin, navigate]);

  const fetchAllNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/notes/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data.notes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    setDeletingId(noteId);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/notes/admin/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Remove note from the list
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Panel
        </button>

        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold">All Notes Management</h1>
        </div>
        <p className="text-muted-foreground">
          View and manage notes from all users
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive mb-6">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 p-4 rounded-lg border border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">Total Notes:</span>
          <span className="text-2xl font-bold">{notes.length}</span>
        </div>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No notes found in the system</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold mb-2 truncate">
                    {note.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{note.user_email || `User #${note.user_id}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Note ID: {note.id}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {note.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={deletingId === note.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === note.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
