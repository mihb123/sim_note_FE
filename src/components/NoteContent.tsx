import { PanelLeftOpen, EllipsisVertical } from "lucide-react";
import { useSelectedNote } from "@/hooks/store";
import { useNotes } from '@/hooks/useNotes';

export default function NoteContent() {
  const { selectedNote } = useSelectedNote() as { selectedNote: string | null };
  const { notes } = useNotes();
  const note = notes.find(n => n.id === selectedNote);

  return (
    <div className="flex-1 min-h-screen">      
      <div className="statusBar flex p-3">
        <div className="flex gap-4 ml-auto">
          <EllipsisVertical />
          <PanelLeftOpen />            
        </div>          
      </div>
      <div className="mainNote p-3">
        <div className="mx-4 typography">
          <h1 className="mb-2">{ note?.title }</h1>
          <p className="mb-4">{note?.content }</p>
        </div>
      </div>
    </div>  
  );
}