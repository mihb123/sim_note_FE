import { Bookmark, FolderClosed, PanelRightOpen, Search } from "lucide-react";
import { memo, useCallback } from "react";
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";
import useActiveTab from "@/hooks/useActiveTab";
import { useSaveNotesData } from "@/data/note.data";
export const tabIcons = [
  { id: 'all', icon: FolderClosed },
  { id: 'search', icon: Search },
  { id: 'save', icon: Bookmark } ] as const;
type tabId = typeof tabIcons[number]['id'];

export const SidebarHeader = memo(() => {
  const closeSidebar = useSidebarStateOpen(s => s.closeSidebar);
  const setActiveTab = useActiveTab((state) => state.setActiveTab)
  const activeTab = useActiveTab((state) => state.activeTab)

  const { mutateSaveNote } = useSaveNotesData();
  const handleClick = useCallback((id: tabId) => {
    setActiveTab(id)
    if (id == 'save') mutateSaveNote();    
  }, [setActiveTab]);
  

  return (
    <div className="flex p-2 mx-2 border-b border-sidebar-border sidebar_header">
      <div className="flex gap-1">
        {tabIcons.map(tab => {
          const Icon = tab.icon;
          return (
            <div key={tab.id} className={`p-2 rounded-md hover:bg-accent hover:cursor-pointer ${activeTab == tab.id ? 'bg-accent active' : ''}`} onClick={handleClick.bind(null, tab.id)}><Icon /></div>
          )
        })}
      </div>
      <div className="ml-auto">
        <div className="p-2 rounded-md">
          <PanelRightOpen onClick={closeSidebar} />
        </div>
      </div>
    </div>
  );
});