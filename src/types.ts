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

export type { User, Note, NotesMap, SaveNoteParams };
