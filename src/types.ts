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

type NoteMetaData = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  is_save: boolean;
  user: {
    id: string;
    name: string;
  }
  created_at: string;
  updated_at: string;
  note_shares: note_shares[] | [];
};

type note_shares = {
  id: string;
  note_id: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

type NotesMap = Record<string, NoteMetaData>;

interface SaveNoteParams {
  text: string;
  focusNote: NoteMetaData
  updateNote: (note: NoteMetaData) => void;
  isSaved: boolean;
};

interface PaginationResponse<NoteMetaData> {
  current_page: number
  data: NoteMetaData[]
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

interface ShareNoteResponse {
  message: string;
  status: string;
  note: NoteMetaData;
}

interface GetSharedNotesResponse {
  id: string;
  user_id: string;
  note_id: string;
  created_at: string;
  updated_at: string;
  note: Note[];
}


export type { User, Note, NotesMap, SaveNoteParams, PaginationResponse, NoteMetaData, ShareNoteResponse, GetSharedNotesResponse };
