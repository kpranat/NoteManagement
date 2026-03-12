import { authService } from './authService';
import { API_BASE_URL } from './config';

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NotesResponse {
  notes: Note[];
  count: number;
}

export interface NoteResponse {
  note: Note;
}

export interface CreateNoteResponse {
  message: string;
  note: Note;
}

export interface ErrorResponse {
  error: string;
}

class NotesService {
  /**
   * Create a new note
   */
  async createNote(data: CreateNoteData): Promise<CreateNoteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create note');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Get all notes for the current user
   */
  async getAllNotes(): Promise<NotesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch notes');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Get a specific note by ID
   */
  async getNoteById(noteId: string): Promise<NoteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch note');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Update a note
   */
  async updateNote(noteId: string, data: UpdateNoteData): Promise<NoteResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update note');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete note');
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

// Export singleton instance
export const notesService = new NotesService();
