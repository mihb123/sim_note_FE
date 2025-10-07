import { FolderClosed, Search, Bookmark, PanelRightOpen } from "lucide-react";

export const SidebarHeader = () => (
  <div className="flex p-3 mx-2 border-b border-sidebar-border">
    <div className="flex gap-4">
      <FolderClosed />
      <Search />
      <Bookmark />
    </div>
    <div className="ml-auto">
      <PanelRightOpen />
    </div>
  </div>
);