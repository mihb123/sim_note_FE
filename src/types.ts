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
  created_at: string;
  updated_at: string;
};

type NotesMap = Record<string, Note>;
type NoteStore = {
  focusNote: Note | null;
  updateNote: (note: Note) => void;
};
export type { User, Note, NotesMap, NoteStore };
