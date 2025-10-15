type User = {
  id: string;
  email: string;
  name: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type Note = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  is_save: boolean;
  created_at: string;
  updated_at: string;
};

type NotesMap = Record<string, Note>;

interface SaveNoteParams {
  text: string;
  focusNote: Note
  updateNote: (note: Note) => void;
  isSaved: boolean;
};

interface PaginationResponse<Note> {
  current_page: number
  data: Note[]
  per_page: number
  total: number
  path: string
  first_page_url: string
  last_page_url: string
  next_page_url?: string
  prev_page_url?: string
  first_page: number
  last_page: number
  from?: number
  to?: number
}

export type { User, Note, NotesMap, SaveNoteParams, PaginationResponse };
