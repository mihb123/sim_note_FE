import '@/styles/Sidebar.css';
import { SidebarHeader } from "@/components/Sidebar/SidebarHeader";
import { SidebarActions } from "@/components/Sidebar/SidebarActions";
import { NoteList } from "@/components/Sidebar/NoteList";
import { SidebarFooter } from "@/components/Sidebar/SidebarFooter";
import SidebarResizer from "./SidebarResize";
import useSidebarResize from "@/hooks/useSidebarResize";
import useActiveTab from '@/hooks/useActiveTab';
import SearchTab from '@/components/Sidebar/SearchTab';

export default function Sidebar() {  
  const { width, startResize } = useSidebarResize();
  const activeTab = useActiveTab((state) => state.activeTab);
  const isSearchTab = activeTab == 'search';

  return (
    <div className="flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative select-none" style={{ width }}>
      <SidebarHeader />
      <div className={`body flex flex-col flex-1 min-h-0 ${isSearchTab ? 'hidden' : ''}`}>
        <SidebarActions />
        <NoteList />
      </div>
      {isSearchTab && <SearchTab />}
      <SidebarFooter />
      <SidebarResizer onMouseDown={startResize} />
    </div>
  );
}