import '@/styles/Sidebar.css';
import { useSelectedNote } from "@/hooks/store";
import { useNotes } from '@/hooks/useNotes';
import { SidebarHeader } from "@/components/Sidebar/SidebarHeader";
import { SidebarActions } from "@/components/Sidebar/SidebarActions";
import { NoteList } from "@/components/Sidebar/NoteList";
import { SidebarFooter } from "@/components/Sidebar/SidebarFooter";

export default function Sidebar() {
  const { selectedNote, setSelectedNote } = useSelectedNote() as { selectedNote: string | null, setSelectedNote: (id: string) => void };
  const { notes } = useNotes();

  const Logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <SidebarHeader />
      <div className="body flex-1 border-b border-sidebar-border">
        <SidebarActions />
        <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={setSelectedNote} />
      </div>
      <div className="footer">
        <SidebarFooter onLogout={Logout} />
      </div>
    </div>
  );
}