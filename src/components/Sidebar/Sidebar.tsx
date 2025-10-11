import '@/styles/Sidebar.css';
import { SidebarHeader } from "@/components/Sidebar/SidebarHeader";
import { SidebarActions } from "@/components/Sidebar/SidebarActions";
import { NoteList } from "@/components/Sidebar/NoteList";
import { SidebarFooter } from "@/components/Sidebar/SidebarFooter";
import SidebarResizer from "./SidebarResize";
import useSidebarResize from "@/hooks/useSidebarResize";

export default function Sidebar() {  
  const { width, startResize } = useSidebarResize();

  return (
    <div className="flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative select-none" style={{ width }}>
      <SidebarHeader />
      <div className="body flex-1 flex flex-col min-h-0 border-b border-sidebar-border">
        <SidebarActions />
        <NoteList />
      </div>
      <SidebarFooter />
      <SidebarResizer onMouseDown={startResize} />
    </div>
  );
}