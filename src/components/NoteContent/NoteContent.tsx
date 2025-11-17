import { PanelLeftOpen, Bookmark } from "lucide-react";
import useNoteContent from "@/hooks/useNoteContent";
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";
import { ActionMenu } from "@/components/NoteContent/ActionMenu";
import { Button } from "@/components/ui/button";
import ShareNotePopup from "@/components/NoteContent/ShareNotePopup";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function NoteContent() {
  const isSidebarOpen = useSidebarStateOpen((state) => state.isOpen);
  const openSidebar = useSidebarStateOpen((state) => state.openSidebar);
  const { editorRef, info, isSaved, setIsSaved, handleSave } = useNoteContent();
  const saveNote = () => {    
    setIsSaved(!isSaved);
    handleSave(!isSaved);
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-x-auto overflow-y-auto">
      <div className="statusBar flex p-3 shrink-0">
        {!isSidebarOpen && <PanelLeftOpen className="mr-auto" onClick={openSidebar} />}
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="hover:cursor-pointer" onClick={saveNote}>
            <Bookmark  className={`bookmark ${isSaved ? "active" : ""}`} />
          </Button>
          <ActionMenu />
          <Dialog>
            <DialogTrigger asChild className="hover:cursor-pointer">
              <Button variant="outline">Share</Button>
            </DialogTrigger>
            <ShareNotePopup />
          </Dialog>          
        </div>
      </div>
      <div ref={editorRef} className={`flex-1 flex overflow-y-auto pl-10 pr-4`} id="sim_editor"></div>
      <div className="text-sm text-gray-500 p-2 ml-auto">
        {info.lines} lines | {info.words} words | {info.chars} chars
      </div>
    </div>
  );
}