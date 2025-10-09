import type { Note } from "@/types";
import { UpdateNote } from "@/api/note";

interface SaveNoteParams {
  text: string;
  focusNote: Note | null;
  updateNote: (note: Note) => void;
}

export const saveNote = ({ text, focusNote, updateNote }: SaveNoteParams) => {
  const [rawTitle, ...body] = text.split("\n");
  const title = rawTitle.replace(/^#\s*/, "") || "Untitled";
  const content = body.join("\n");

  const newNote: Note = {
    ...focusNote,
    title,
    content,
    updated_at: new Date().toISOString(),
  };

  updateNote(newNote);
  UpdateNote(newNote).catch((err) => console.error("Failed to update note:", err));
};