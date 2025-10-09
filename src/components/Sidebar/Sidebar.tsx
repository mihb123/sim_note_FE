import '@/styles/Sidebar.css';
import { SidebarHeader } from "@/components/Sidebar/SidebarHeader";
import { SidebarActions } from "@/components/Sidebar/SidebarActions";
import { NoteList } from "@/components/Sidebar/NoteList";
import { SidebarFooter } from "@/components/Sidebar/SidebarFooter";

export default function Sidebar() {  



  return (
    <div className="flex flex-col w-64 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarHeader />
      <div className="body flex-1 flex flex-col min-h-0 border-b border-sidebar-border">
        <SidebarActions />
        <NoteList />
      </div>
      <div className="footer">
        <SidebarFooter />
      </div>
    </div>
  );
}