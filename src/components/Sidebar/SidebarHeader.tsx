import { FolderClosed, Search, Bookmark, PanelRightOpen } from "lucide-react";
import { memo } from "react"; 
import useSidebarStateOpen from "@/hooks/useSidebarStateOpen";
import { useShallow } from "zustand/shallow";

export const SidebarHeader = memo(() => {
  const closeSidebar = useSidebarStateOpen(useShallow((state) => state.closeSidebar));
    
  return (
    <div className="flex p-3 mx-2 border-b border-sidebar-border">
      <div className="flex gap-4">
        <FolderClosed />
        <Search />
        <Bookmark />
      </div>
      <div className="ml-auto">
        <PanelRightOpen onClick={closeSidebar}/>
      </div>
    </div>
  );
});