import { FolderClosed, Search, Bookmark, PanelRightOpen } from "lucide-react";
import { memo } from "react"; 
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";
import { useShallow } from "zustand/shallow";
import useActiveTab from "@/hooks/useActiveTab";

export const SidebarHeader = memo(() => {
  const closeSidebar = useSidebarStateOpen(useShallow((state) => state.closeSidebar));
  const activeTab = useActiveTab((state) => state.activeTab)
  const setActiveTab = useActiveTab((state) => state.setActiveTab)
  return (
    <div className="flex p-2 mx-2 border-b border-sidebar-border sidebar_header">
      <div className="flex gap-1">
        <div className={`p-2 rounded-md ${activeTab == 'all' ? 'bg-accent active' : ''}`} onClick={() => setActiveTab('all')}>
          <FolderClosed />
        </div>      
        <div className={`p-2 rounded-md ${activeTab == 'search' ? 'bg-accent active' : ''}`} onClick={() => setActiveTab('search')}>
          <Search />
        </div>
        <div className={`p-2 rounded-md ${activeTab == 'save' ? 'bg-accent active' : ''}`} onClick={() => setActiveTab('save')}>
          <Bookmark />
        </div>
      </div>
      <div className="ml-auto">
        <div className="p-2 rounded-md">
          <PanelRightOpen onClick={closeSidebar} />
        </div>        
      </div>
    </div>
  );
});