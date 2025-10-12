import { PanelRight, PanelLeftOpen, EllipsisVertical, Bookmark } from "lucide-react";
import useNoteContent from "@/hooks/useNoteContent";
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";

export default function NoteContent() {
  const isSidebarOpen = useSidebarStateOpen((state) => state.isOpen);
  const openSidebar = useSidebarStateOpen((state) => state.openSidebar);
  const { editorRef, info, isSaved, setIsSaved, handleSave} = useNoteContent();
  const saveNote = () => {    
    setIsSaved(!isSaved);
    handleSave(!isSaved);
  }
  log("NoteContent run")
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="statusBar flex p-3 shrink-0">
        {!isSidebarOpen && <PanelLeftOpen className="mr-auto" onClick={openSidebar} />}
        <div className="flex gap-4 ml-auto">
          <Bookmark onClick={saveNote} className={`bookmark ${isSaved ? "active" : ""}`} />
          <EllipsisVertical />
          <PanelRight />
        </div>
      </div>
      <div ref={editorRef} className="flex-1 overflow-y-auto pl-10 pr-4" id="sim_editor"></div>
      <div className="text-sm text-gray-500 p-2 ml-auto">
        {info.lines} lines | {info.words} words | {info.chars} chars
      </div>
    </div>
  );
}