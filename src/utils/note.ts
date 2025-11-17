import type { SaveNoteParams, NoteMetaData } from "@/types";
import { UpdateNote } from "@/api/note.api";

export const saveNote = ({ text, focusNote, updateNote, isSaved }: SaveNoteParams) => {
  const [rawTitle, ...body] = text.split("\n");
  const title = rawTitle.replace(/^#\s*/, "") || "Untitled";
  const content = body.join("\n");

  const newNote: NoteMetaData = {
    ...focusNote,
    is_save: isSaved,
    title,
    content,
    updated_at: new Date().toISOString(),
  };

  updateNote(newNote);
  UpdateNote(newNote).catch((err) => console.error("Failed to update note:", err));
};